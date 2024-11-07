<?php
/**
 * MVX Catalog Enquiry Cart Button Section
 *
 * Override this template by copying it to yourtheme/woocommerce-catalog-enquiry/quote-button-template.php
 *
 * @author    MultiVendorX
 * @package   woocommerce-catalog-enquiry/Templates
 * @version   1.0.0
 */


$data_variations = ( isset( $variations ) && ! empty( $variations ) ) ? ' data-variation="' . $variations . '" ' : '';
$button_position_settings = Catalog()->setting->get_setting( 'shop_page_button_position_setting' );
$button_position_settings = is_array($button_position_settings) ? $button_position_settings : [];
$position = array_search('quote_button', $button_position_settings);
$position = $position !== false ? $position : 0;
?>
<div class="catalog-add-to-quote add-to-quote-<?php echo esc_attr( $args['product_id'] ); ?>" position = "<?php echo $position; ?>">

	<div class="catalog-add-button <?php echo ( $args['exists'] ) ? 'hide' : 'show'; ?>" style="display:<?php echo ( $args['exists'] ) ? 'none' : 'block'; ?>"  data-product_id="<?php echo esc_attr( $args['product_id'] ); ?>">
        <button href="#" class="<?php echo esc_attr( $args['class'] ); ?> " style = "<?php echo $args['btn_style'] ?>" data-product_id="<?php echo esc_attr( $args['product_id'] ); ?>" data-wp_nonce="<?php echo esc_attr( $args['wpnonce'] ); ?>"><?php echo esc_html( $args['label'] ); ?></button>

	</div>
	<div
		class="quote_add_item_product-response-<?php echo esc_attr( $args['product_id'] ); ?>"
		style="display:none" data-product_id="<?php echo esc_attr( $args['product_id'] ); ?>"></div>
	<div
		class="quote_add_item_response-<?php echo esc_attr( $args['product_id'] ); ?> quote_add_item_response_message <?php echo esc_attr( ( ! $args['exists'] ) ? 'hide' : 'show' ); ?> hide-when-removed"
		data-product_id="<?php echo esc_attr( $args['product_id'] ); ?>"
		style="display:<?php echo ( ! $args['exists'] ) ? 'none' : 'block'; ?>"><?php echo esc_html('Product already in your quote list' ); ?></div>
	<div
		class="quote_add_item_browse-list-<?php echo esc_attr( $args['product_id'] ); ?> quote_add_item_browse_message  <?php echo esc_attr( ( ! $args['exists'] ) ? 'hide' : 'show' ); ?> hide-when-removed"
		style="display:<?php echo esc_attr( ( ! $args['exists'] ) ? 'none' : 'block' ); ?>"
		data-product_id="<?php echo esc_attr( $args['product_id'] ); ?>"><a
			href="<?php echo esc_url( $args['rqa_url'] ); ?>" style = "<?php echo $args['btn_style'] ?>" class="button alt wp-element-button"><?php echo esc_html( $args['label_browse'] ); ?></a></div>
</div>
<div class="clear"></div>