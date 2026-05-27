<?php
/**
 * Render server-side del blocco livemuseum/carousel-flat.
 *
 * @var array  $attributes
 * @var string $content
 * @var WP_Block $block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$heading      = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$link_label   = isset( $attributes['linkLabel'] ) ? (string) $attributes['linkLabel'] : '';
$link_url     = isset( $attributes['linkUrl'] ) ? (string) $attributes['linkUrl'] : '';
$variant      = isset( $attributes['variant'] ) ? (string) $attributes['variant'] : 'arch';
$post_source  = isset( $attributes['postSource'] ) ? (string) $attributes['postSource'] : 'all';
$category_ids = isset( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] )
	? array_values( array_filter( array_map( 'intval', $attributes['categoryIds'] ) ) )
	: array();
$post_count   = isset( $attributes['postCount'] ) ? (int) $attributes['postCount'] : 20;
if ( $post_count < 1 ) {
	$post_count = 20;
}

if ( ! in_array( $variant, array( 'arch', 'square' ), true ) ) {
	$variant = 'arch';
}

$query_args = array(
	'post_type'           => 'post',
	'posts_per_page'      => $post_count,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);

// Risoluzione sorgente post.
switch ( $post_source ) {
	case 'current_category':
		$queried = get_queried_object();
		if ( $queried instanceof WP_Term && 'category' === $queried->taxonomy ) {
			$query_args['category__in'] = array( (int) $queried->term_id );
		}
		break;

	case 'fixed_categories':
		if ( ! empty( $category_ids ) ) {
			$query_args['category__in'] = $category_ids;
		}
		break;

	case 'same_tags':
	case 'same_categories':
	case 'same_tags_or_categories':
		// Modalità related: hanno senso solo nel context di un singolo post.
		$current_id = get_the_ID();
		if ( ! $current_id || ! is_singular( 'post' ) ) {
			// Fuori da single: fallback su "tutti" senza filtri.
			break;
		}
		$query_args['post__not_in'] = array( $current_id );

		$tag_ids = wp_get_post_tags( $current_id, array( 'fields' => 'ids' ) );
		$cat_ids = wp_get_post_categories( $current_id );

		$tax_query = array( 'relation' => 'OR' );
		if ( 'same_tags' === $post_source || 'same_tags_or_categories' === $post_source ) {
			if ( ! empty( $tag_ids ) ) {
				$tax_query[] = array(
					'taxonomy' => 'post_tag',
					'field'    => 'term_id',
					'terms'    => $tag_ids,
				);
			}
		}
		if ( 'same_categories' === $post_source || 'same_tags_or_categories' === $post_source ) {
			if ( ! empty( $cat_ids ) ) {
				$tax_query[] = array(
					'taxonomy' => 'category',
					'field'    => 'term_id',
					'terms'    => $cat_ids,
				);
			}
		}
		// Senza rami (post senza tag né categorie) niente tax_query: evita una query vuota.
		if ( count( $tax_query ) > 1 ) {
			$query_args['tax_query'] = $tax_query;
		}
		break;

	case 'all':
	default:
		// Nessun filtro.
		break;
}

// Categorie nel badge: con filtro (current/fixed) solo quelle del filtro, con all/related tutte.
$highlight_cat_ids = null; // null = tutte
if ( 'current_category' === $post_source ) {
	$queried = get_queried_object();
	if ( $queried instanceof WP_Term && 'category' === $queried->taxonomy ) {
		$highlight_cat_ids = array( (int) $queried->term_id );
	}
} elseif ( 'fixed_categories' === $post_source && ! empty( $category_ids ) ) {
	$highlight_cat_ids = $category_ids;
}

$query = new WP_Query( $query_args );
if ( ! $query->have_posts() ) {
	return '';
}

$cards = array();
while ( $query->have_posts() ) {
	$query->the_post();
	$post_id   = get_the_ID();
	$image_url = has_post_thumbnail( $post_id ) ? get_the_post_thumbnail_url( $post_id, 'large' ) : '';

	$display_cats = array();
	foreach ( get_the_category( $post_id ) as $cat ) {
		if ( null === $highlight_cat_ids || in_array( $cat->term_id, $highlight_cat_ids, true ) ) {
			$display_cats[] = array(
				'name' => $cat->name,
				'link' => get_category_link( $cat->term_id ),
			);
		}
	}

	$cards[] = array(
		'id'         => $post_id,
		'title'      => get_the_title( $post_id ),
		'permalink'  => get_permalink( $post_id ),
		'image'      => $image_url,
		'categories' => $display_cats,
		'date'       => get_the_date( 'F j, Y', $post_id ),
	);
}
wp_reset_postdata();

$total = count( $cards );

$context = array(
	'currentIndex' => 0,
	'total'        => $total,
);

$wrapper_attrs = get_block_wrapper_attributes(
	array(
		'class'               => 'lm-carousel-flat lm-carousel-flat--' . sanitize_html_class( $variant ),
		'data-wp-interactive' => 'livemuseum/carousel-flat',
		'data-wp-context'     => wp_json_encode( $context ),
		'data-wp-init'        => 'callbacks.applyTransforms',
		'data-wp-watch'       => 'callbacks.applyTransforms',
	)
);

$arrow_svg = '<svg class="lm-carousel-flat__arrow-icon" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M1 12.3333L25 12.3333M13.6667 1L25 12.3333L13.6667 23.6667" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
?>
<section <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<header class="lm-section-header">
		<?php if ( '' !== $heading ) : ?>
			<h2 class="lm-section-header__title"><?php echo esc_html( $heading ); ?></h2>
		<?php endif; ?>
		<?php if ( '' !== $link_url ) : ?>
			<a class="lm-section-header__link" href="<?php echo esc_url( $link_url ); ?>">
				<?php echo esc_html( '' !== $link_label ? $link_label : __( 'Scopri di più', 'livemuseum' ) ); ?>
			</a>
		<?php endif; ?>
	</header>

	<div
		class="lm-carousel-flat__track"
		data-wp-on--touchstart="actions.onTouchStart"
		data-wp-on--touchend="actions.onTouchEnd"
	>
		<?php foreach ( $cards as $index => $card ) : ?>
			<article class="lm-carousel-flat__card" data-index="<?php echo (int) $index; ?>">
				<div class="lm-carousel-flat__meta">
						<div class="lm-carousel-flat__categories">
							<?php foreach ( $card['categories'] as $cat ) : ?>
								<a class="lm-carousel-flat__category" href="<?php echo esc_url( $cat['link'] ); ?>"><?php echo esc_html( $cat['name'] ); ?></a>
							<?php endforeach; ?>
						</div>
						<time class="lm-carousel-flat__date"><?php echo esc_html( $card['date'] ); ?></time>
					</div>
					<a class="lm-carousel-flat__link" href="<?php echo esc_url( $card['permalink'] ); ?>">
						<div class="lm-carousel-flat__media">
						<?php if ( '' !== $card['image'] ) : ?>
							<img
								class="lm-carousel-flat__image"
								data-src="<?php echo esc_url( $card['image'] ); ?>"
								alt="<?php echo esc_attr( $card['title'] ); ?>"
								loading="lazy"
							/>
						<?php endif; ?>
						<h3 class="lm-carousel-flat__title"><?php echo esc_html( $card['title'] ); ?></h3>
					</div>
				</a>
			</article>
		<?php endforeach; ?>
	</div>

	<nav class="lm-carousel-flat__nav" aria-label="<?php echo esc_attr__( 'Navigazione carousel', 'livemuseum' ); ?>">
		<button
			type="button"
			class="lm-carousel-flat__arrow lm-carousel-flat__arrow--prev"
			data-wp-on--click="actions.prev"
			aria-label="<?php echo esc_attr__( 'Precedente', 'livemuseum' ); ?>"
		><?php echo $arrow_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
		<button
			type="button"
			class="lm-carousel-flat__arrow lm-carousel-flat__arrow--next"
			data-wp-on--click="actions.next"
			aria-label="<?php echo esc_attr__( 'Successivo', 'livemuseum' ); ?>"
		><?php echo $arrow_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
	</nav>
</section>
