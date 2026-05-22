<?php
/**
 * Render server-side del blocco livemuseum/post-grid.
 *
 * @var array  $attributes
 * @var string $content
 * @var WP_Block $block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$heading       = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$link_label    = isset( $attributes['linkLabel'] ) ? (string) $attributes['linkLabel'] : '';
$link_url      = isset( $attributes['linkUrl'] ) ? (string) $attributes['linkUrl'] : '';
$post_source   = isset( $attributes['postSource'] ) ? (string) $attributes['postSource'] : 'all';
$category_ids  = isset( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] )
	? array_values( array_filter( array_map( 'intval', $attributes['categoryIds'] ) ) )
	: array();
$initial_count = isset( $attributes['initialCount'] ) ? max( 1, (int) $attributes['initialCount'] ) : 12;
$batch_size    = isset( $attributes['batchSize'] ) ? max( 1, (int) $attributes['batchSize'] ) : 12;
$max_posts     = isset( $attributes['maxPosts'] ) ? max( 1, (int) $attributes['maxPosts'] ) : 200;

$query_args = array(
	'post_type'           => 'post',
	'posts_per_page'      => $max_posts,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);

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

	case 'all':
	default:
		break;
}

$query = new WP_Query( $query_args );
if ( ! $query->have_posts() ) {
	return '';
}

$cards = array();
while ( $query->have_posts() ) {
	$query->the_post();
	$post_id    = get_the_ID();
	$image_url  = has_post_thumbnail( $post_id ) ? get_the_post_thumbnail_url( $post_id, 'large' ) : '';
	$categories = get_the_category( $post_id );
	$cat_name   = ! empty( $categories ) ? $categories[0]->name : '';
	$cards[] = array(
		'id'        => $post_id,
		'title'     => get_the_title( $post_id ),
		'permalink' => get_permalink( $post_id ),
		'image'     => $image_url,
		'category'  => $cat_name,
		'date'      => get_the_date( 'F j, Y', $post_id ),
	);
}
wp_reset_postdata();

$total          = count( $cards );
$visible_count  = min( $initial_count, $total );

$context = array(
	'visibleCount' => $visible_count,
	'total'        => $total,
	'batchSize'    => $batch_size,
);

$wrapper_attrs = get_block_wrapper_attributes(
	array(
		'class'               => 'lm-post-grid',
		'data-wp-interactive' => 'livemuseum/post-grid',
		'data-wp-context'     => wp_json_encode( $context ),
		'data-wp-init'        => 'callbacks.init',
		'data-wp-watch'       => 'callbacks.applyVisibility',
	)
);
?>
<section <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( '' !== $heading || '' !== $link_url ) : ?>
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
	<?php endif; ?>

	<div class="lm-post-grid__grid">
		<?php foreach ( $cards as $index => $card ) : ?>
			<article class="lm-post-grid__card" data-index="<?php echo (int) $index; ?>">
				<a class="lm-post-grid__link" href="<?php echo esc_url( $card['permalink'] ); ?>">
					<div class="lm-post-grid__meta">
						<?php if ( '' !== $card['category'] ) : ?>
							<span class="lm-post-grid__category"><?php echo esc_html( $card['category'] ); ?></span>
						<?php else : ?>
							<span></span>
						<?php endif; ?>
						<time class="lm-post-grid__date"><?php echo esc_html( $card['date'] ); ?></time>
					</div>
					<div class="lm-post-grid__media">
						<?php if ( '' !== $card['image'] ) : ?>
							<img
								class="lm-post-grid__image"
								data-src="<?php echo esc_url( $card['image'] ); ?>"
								alt="<?php echo esc_attr( $card['title'] ); ?>"
								loading="lazy"
							/>
						<?php endif; ?>
						<h3 class="lm-post-grid__title"><?php echo esc_html( $card['title'] ); ?></h3>
					</div>
				</a>
			</article>
		<?php endforeach; ?>
	</div>

	<div class="lm-post-grid__sentinel" aria-hidden="true"></div>
	<p class="lm-post-grid__status lm-post-grid__status--end"><?php echo esc_html__( 'Fine dei risultati', 'livemuseum' ); ?></p>
</section>
