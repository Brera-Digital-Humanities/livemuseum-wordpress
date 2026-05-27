<?php
/**
 * Render server-side del blocco livemuseum/carousel-featured.
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
$post_source  = isset( $attributes['postSource'] ) ? (string) $attributes['postSource'] : 'all';
$category_ids = isset( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] )
	? array_values( array_filter( array_map( 'intval', $attributes['categoryIds'] ) ) )
	: array();
$post_count   = isset( $attributes['postCount'] ) ? (int) $attributes['postCount'] : 20;
if ( $post_count < 1 ) {
	$post_count = 20;
}

$query_args = array(
	'post_type'           => 'post',
	'posts_per_page'      => $post_count,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);

if ( 'current_category' === $post_source ) {
	// Solo nel template archivio categoria: get_queried_object restituisce il WP_Term.
	$queried = get_queried_object();
	if ( $queried instanceof WP_Term && 'category' === $queried->taxonomy ) {
		$query_args['category__in'] = array( (int) $queried->term_id );
	}
} elseif ( 'fixed_categories' === $post_source && ! empty( $category_ids ) ) {
	$query_args['category__in'] = $category_ids;
}

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
	return '';
}

$slides = array();
while ( $query->have_posts() ) {
	$query->the_post();
	$post_id   = get_the_ID();
	$image_url = has_post_thumbnail( $post_id ) ? get_the_post_thumbnail_url( $post_id, 'large' ) : '';
	$tags_raw  = get_the_tags( $post_id );
	$tags      = is_array( $tags_raw )
		? array_map(
			static function ( $tag ) {
				return array(
					'name' => $tag->name,
					'link' => get_tag_link( $tag->term_id ),
				);
			},
			$tags_raw
		)
		: array();
	$slides[] = array(
		'id'        => $post_id,
		'title'     => get_the_title( $post_id ),
		'excerpt'   => get_the_excerpt( $post_id ),
		'permalink' => get_permalink( $post_id ),
		'image'     => $image_url,
		'tags'      => $tags,
	);
}
wp_reset_postdata();

$total = count( $slides );

$context = array(
	'currentIndex' => 0,
	'total'        => $total,
);

$wrapper_attrs = get_block_wrapper_attributes(
	array(
		'class'               => 'lm-carousel-featured',
		'data-wp-interactive' => 'livemuseum/carousel-featured',
		'data-wp-context'     => wp_json_encode( $context ),
		'data-wp-init'        => 'callbacks.applyTransforms',
		'data-wp-watch'       => 'callbacks.applyTransforms',
	)
);

$arrow_svg = '<svg class="lm-carousel-featured__arrow-icon" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M1 12.3333L25 12.3333M13.6667 1L25 12.3333L13.6667 23.6667" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
		class="lm-carousel-featured__images"
		data-wp-on--touchstart="actions.onTouchStart"
		data-wp-on--touchend="actions.onTouchEnd"
	>
		<?php foreach ( $slides as $index => $slide ) : ?>
			<div class="lm-carousel-featured__image-slide" data-index="<?php echo (int) $index; ?>">
				<button
					type="button"
					class="lm-carousel-featured__hit"
					data-index="<?php echo (int) $index; ?>"
					data-wp-on--click="actions.onSlideClick"
					aria-label="<?php echo esc_attr( sprintf( __( 'Vai alla slide %d', 'livemuseum' ), $index + 1 ) ); ?>"
				></button>
				<?php if ( '' !== $slide['image'] ) : ?>
					<img
						class="lm-carousel-featured__image"
						data-src="<?php echo esc_url( $slide['image'] ); ?>"
						alt="<?php echo esc_attr( $slide['title'] ); ?>"
						loading="lazy"
					/>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>

	<div class="lm-carousel-featured__boxes">
		<?php foreach ( $slides as $index => $slide ) : ?>
			<article class="lm-carousel-featured__box-slide" data-index="<?php echo (int) $index; ?>">
				<h3 class="lm-carousel-featured__title">
					<a href="<?php echo esc_url( $slide['permalink'] ); ?>">
						<?php echo esc_html( $slide['title'] ); ?>
					</a>
				</h3>
				<?php if ( '' !== $slide['excerpt'] ) : ?>
					<p class="lm-carousel-featured__excerpt"><?php echo esc_html( $slide['excerpt'] ); ?></p>
				<?php endif; ?>
				<?php if ( ! empty( $slide['tags'] ) ) : ?>
					<ul class="lm-carousel-featured__tags">
						<?php foreach ( $slide['tags'] as $tag ) : ?>
							<li><a href="<?php echo esc_url( $tag['link'] ); ?>"><?php echo esc_html( $tag['name'] ); ?></a></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</article>
		<?php endforeach; ?>
	</div>

	<nav class="lm-carousel-featured__nav" aria-label="<?php echo esc_attr__( 'Navigazione carousel', 'livemuseum' ); ?>">
		<button
			type="button"
			class="lm-carousel-featured__arrow lm-carousel-featured__arrow--prev"
			data-wp-on--click="actions.prev"
			aria-label="<?php echo esc_attr__( 'Precedente', 'livemuseum' ); ?>"
		><?php echo $arrow_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
		<button
			type="button"
			class="lm-carousel-featured__arrow lm-carousel-featured__arrow--next"
			data-wp-on--click="actions.next"
			aria-label="<?php echo esc_attr__( 'Successivo', 'livemuseum' ); ?>"
		><?php echo $arrow_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
	</nav>
</section>
