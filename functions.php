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
