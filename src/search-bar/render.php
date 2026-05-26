<?php
/**
 * Render server-side del blocco livemuseum/search-bar.
 *
 * @var array $attributes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$placeholder  = isset( $attributes['placeholder'] ) ? (string) $attributes['placeholder'] : '';
$button_label = isset( $attributes['buttonLabel'] ) ? (string) $attributes['buttonLabel'] : '';
$action_url   = isset( $attributes['actionUrl'] ) ? (string) $attributes['actionUrl'] : '';
$param_name   = isset( $attributes['paramName'] ) && '' !== $attributes['paramName'] ? (string) $attributes['paramName'] : 'q';

$wrapper_attrs = get_block_wrapper_attributes(
	array( 'class' => 'lm-search-bar' )
);
?>
<form
	<?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	action="<?php echo esc_url( $action_url ); ?>"
	method="get"
	role="search"
>
	<input
		class="lm-search-bar__input"
		type="search"
		name="<?php echo esc_attr( $param_name ); ?>"
		placeholder="<?php echo esc_attr( $placeholder ); ?>"
		aria-label="<?php echo esc_attr( '' !== $placeholder ? $placeholder : __( 'Cerca', 'livemuseum' ) ); ?>"
	/>
	<button class="lm-search-bar__button" type="submit">
		<?php echo esc_html( '' !== $button_label ? $button_label : __( 'Cerca', 'livemuseum' ) ); ?>
	</button>
</form>
