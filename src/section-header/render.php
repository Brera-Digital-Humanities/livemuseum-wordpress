<?php
/**
 * Render server-side del blocco livemuseum/section-header.
 *
 * @var array $attributes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$heading    = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$link_label = isset( $attributes['linkLabel'] ) ? (string) $attributes['linkLabel'] : '';
$link_url   = isset( $attributes['linkUrl'] ) ? (string) $attributes['linkUrl'] : '';

if ( '' === $heading && '' === $link_url ) {
	return '';
}

$wrapper_attrs = get_block_wrapper_attributes(
	array( 'class' => 'lm-section-header' )
);
?>
<header <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( '' !== $heading ) : ?>
		<h2 class="lm-section-header__title"><?php echo esc_html( $heading ); ?></h2>
	<?php endif; ?>
	<?php if ( '' !== $link_url ) : ?>
		<a class="lm-section-header__link" href="<?php echo esc_url( $link_url ); ?>">
			<?php echo esc_html( '' !== $link_label ? $link_label : __( 'Scopri di più', 'livemuseum' ) ); ?>
		</a>
	<?php endif; ?>
</header>
