<?php
/**
 * LiveMuseum — child theme di Twenty Twenty-Five.
 *
 * @package livemuseum
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Enqueue: header child + bundle SCSS globale, dipendenti dallo style del parent.
add_action(
	'wp_enqueue_scripts',
	static function () {
		$theme_dir = get_stylesheet_directory();
		$theme_uri = get_stylesheet_directory_uri();

		$style_css = $theme_dir . '/style.css';
		wp_enqueue_style(
			'livemuseum-style',
			$theme_uri . '/style.css',
			array( 'twentytwentyfive-style' ),
			file_exists( $style_css ) ? (string) filemtime( $style_css ) : '1.0.0'
		);

		$global_css = $theme_dir . '/build/style/style-style.css';
		if ( file_exists( $global_css ) ) {
			wp_enqueue_style(
				'livemuseum-global',
				$theme_uri . '/build/style/style-style.css',
				array( 'twentytwentyfive-style', 'livemuseum-style' ),
				(string) filemtime( $global_css )
			);
		}
	},
	20
);

// Registra tutti i blocchi compilati in build/<blocco>/block.json.
add_action(
	'init',
	static function () {
		$build_dir = get_stylesheet_directory() . '/build';
		if ( ! is_dir( $build_dir ) ) {
			return;
		}

		foreach ( glob( $build_dir . '/*', GLOB_ONLYDIR ) as $block_dir ) {
			if ( file_exists( $block_dir . '/block.json' ) ) {
				register_block_type( $block_dir );
			}
		}
	}
);

// Cache busting: forza ?ver=filemtime() sugli asset di /build/.
$livemuseum_filemtime_versioning = static function ( $src ) {
	if ( ! is_string( $src ) || '' === $src ) {
		return $src;
	}

	$theme_uri = get_stylesheet_directory_uri();
	if ( strpos( $src, $theme_uri . '/build/' ) === false ) {
		return $src;
	}

	$relative = substr( $src, strlen( $theme_uri ) );
	$path     = get_stylesheet_directory() . strtok( $relative, '?' );

	if ( ! file_exists( $path ) ) {
		return $src;
	}

	$src = remove_query_arg( 'ver', $src );
	return add_query_arg( 'ver', (string) filemtime( $path ), $src );
};

add_filter( 'style_loader_src', $livemuseum_filemtime_versioning, 99 );
add_filter( 'script_loader_src', $livemuseum_filemtime_versioning, 99 );

add_filter(
	'excerpt_length',
	static function () {
		return 28;
	},
	999
);

// Abilita i controlli colore (testo + sfondo) sui singoli link di navigazione.
add_filter(
	'register_block_type_args',
	static function ( $args, $name ) {
		if ( 'core/navigation-link' === $name ) {
			if ( ! isset( $args['supports'] ) || ! is_array( $args['supports'] ) ) {
				$args['supports'] = array();
			}
			$args['supports']['color'] = array(
				'text'       => true,
				'background' => true,
			);
		}
		return $args;
	},
	10,
	2
);

// Varianti di stile hover selezionabili dall'editor sui link di navigazione.
add_action(
	'init',
	static function () {
		register_block_style(
			'core/navigation-link',
			array(
				'name'  => 'hover-underline',
				'label' => __( 'Sottolineato in hover', 'livemuseum' ),
			)
		);
		register_block_style(
			'core/navigation-link',
			array(
				'name'  => 'hover-accent',
				'label' => __( 'Colore accent in hover', 'livemuseum' ),
			)
		);
	}
);

// Marca il link della pagina corrente con aria-current="page" (il blocco Navigation non lo fa; stile in _main-navbar.scss).
add_filter(
	'render_block_core/navigation',
	static function ( $content ) {
		if ( is_admin() || '' === trim( (string) $content ) ) {
			return $content;
		}

		// Path canonico della richiesta corrente (senza slash iniziale/finale).
		if ( is_front_page() || is_home() ) {
			$current = '';
		} elseif ( is_singular() ) {
			$current = (string) wp_parse_url( get_permalink(), PHP_URL_PATH );
		} else {
			$obj = get_queried_object();
			$link = ( $obj instanceof WP_Term ) ? get_term_link( $obj ) : '';
			$current = ( $link && ! is_wp_error( $link ) ) ? (string) wp_parse_url( $link, PHP_URL_PATH ) : null;
		}
		if ( null === $current ) {
			return $content;
		}
		$current = trim( $current, '/' );

		return preg_replace_callback(
			'/<a\s[^>]*href="([^"]*)"[^>]*>/i',
			static function ( $m ) use ( $current ) {
				if ( false !== stripos( $m[0], 'aria-current' ) ) {
					return $m[0];
				}
				$path = trim( (string) wp_parse_url( html_entity_decode( $m[1] ), PHP_URL_PATH ), '/' );
				if ( $path !== $current ) {
					return $m[0];
				}
				return preg_replace( '/^<a\s/i', '<a aria-current="page" ', $m[0] );
			},
			$content
		);
	}
);
