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

$show_header     = ! empty( $attributes['showHeader'] );
$heading         = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$link_label      = isset( $attributes['linkLabel'] ) ? (string) $attributes['linkLabel'] : '';
$link_url        = isset( $attributes['linkUrl'] ) ? (string) $attributes['linkUrl'] : '';
$pagination_mode = isset( $attributes['paginationMode'] ) && 'fixed' === $attributes['paginationMode'] ? 'fixed' : 'infinite';
$post_source     = isset( $attributes['postSource'] ) ? (string) $attributes['postSource'] : 'all';
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

// Categorie da mostrare nel badge: filtro per categoria → solo quelle del
// filtro; all → tutte le categorie del post.
$highlight_cat_ids = null;
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

// In modalità "fixed" si mostrano tutte le card renderizzate (nessun infinite
// scroll); in "infinite" si parte da $initial_count e si carica a batch.
$visible_count = 'fixed' === $pagination_mode ? $total : min( $initial_count, $total );

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
	<?php if ( $show_header && ( '' !== $heading || '' !== $link_url ) ) : ?>
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
				<div class="lm-post-grid__meta">
						<div class="lm-post-grid__categories">
							<?php foreach ( $card['categories'] as $cat ) : ?>
								<a class="lm-post-grid__category" href="<?php echo esc_url( $cat['link'] ); ?>"><?php echo esc_html( $cat['name'] ); ?></a>
							<?php endforeach; ?>
						</div>
						<time class="lm-post-grid__date"><?php echo esc_html( $card['date'] ); ?></time>
					</div>
					<a class="lm-post-grid__link" href="<?php echo esc_url( $card['permalink'] ); ?>">
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

	<?php if ( 'infinite' === $pagination_mode ) : ?>
		<div class="lm-post-grid__sentinel" aria-hidden="true"></div>
		<p class="lm-post-grid__status lm-post-grid__status--end"><?php echo esc_html__( 'Fine dei risultati', 'livemuseum' ); ?></p>
	<?php endif; ?>
</section>
