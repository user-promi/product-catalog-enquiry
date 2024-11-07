<?php
/**
 * Woocommerce Catalog Enquiry Admin
 *
 * @author 	MultiVendorX
 * @version   3.3
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

do_action( 'woocommerce_email_header', $email_heading ); ?>

<p><?php esc_html_e('Dear Admin','woocommerce-catalog-enquiry');?>,</p>
<p><?php esc_html_e('Please find the product enquiry, details are given below','woocommerce-catalog-enquiry');?>.</p>

<h3><?php esc_html_e( 'Product Details', 'woocommerce-catalog-enquiry' ); ?></h3>
<table cellspacing="0" cellpadding="6" style="width: 100%; border: 1px solid #eee;" border="1" bordercolor="#eee">
	<thead>
		<tr>
			<th scope="col"><?php esc_html_e( 'Product', 'woocommerce-catalog-enquiry' ); ?></th>
			<th scope="col"><?php esc_html_e( 'Product Url', 'woocommerce-catalog-enquiry' ); ?></th>
			<th scope="col"><?php esc_html_e( 'Product SKU', 'woocommerce-catalog-enquiry' ); ?></th>
		</tr>
	</thead>
	<tbody>
		<?php 
		if (is_array($product_id) && count($product_id) > 1) {
			foreach ($product_id as $id => $value) {
				$product_obj = wc_get_product( $id ); ?>
				<tr>
				<td scope="col"><?php echo $product_obj->get_name(); ?>
				<?php 
					if ($product_obj->get_type() == 'variation') {
						if (isset($enquiry_data['variations']) && count($enquiry_data['variations']) > 0 ) {
							foreach ($enquiry_data['variations'] as $label => $value) {
								$label = str_replace( 'attribute_pa_', '', $label );
								$label = str_replace( 'attribute_', '', $label );
								echo "<br>".ucfirst($label).": ".ucfirst($value);
							} 
						}else{
							if ($product_obj->get_attributes()) {
								foreach ($product_obj->get_attributes() as $label => $value) {
									echo "<br>".ucfirst(wc_attribute_label($label)).": ".ucfirst($value);
								}
							}
						}
					} ?>
				</td>
				<td scope="col"><a href="<?php echo $product_obj->get_permalink(); ?>" target="_blank"><?php echo $product_obj->get_title(); ?></a></td>
				<?php if ($product_obj->get_sku()) { ?>
				<td scope="col"><?php echo $product_obj->get_sku(); ?></td>
				<?php } else { ?>
					<td scope="col"><?php echo '-'; ?></td>
				<?php }?>
			</tr>
			<?php
			}
		} else {
			$product_obj = wc_get_product( key($product_id) ); ?>
			<tr>
			<td scope="col"><?php echo $product_obj->get_name(); ?>
			<?php 
				if ($product_obj->get_type() == 'variation') {
					if (isset($enquiry_data['variations']) && count($enquiry_data['variations']) > 0 ) {
						foreach ($enquiry_data['variations'] as $label => $value) {
							$label = str_replace( 'attribute_pa_', '', $label );
							$label = str_replace( 'attribute_', '', $label );
							echo "<br>".ucfirst($label).": ".ucfirst($value);
						} 
					}else{
						if ($product_obj->get_attributes()) {
							foreach ($product_obj->get_attributes() as $label => $value) {
								echo "<br>".ucfirst(wc_attribute_label($label)).": ".ucfirst($value);
							}
						}
					}
				} ?>
			</td>
			<td scope="col"><a href="<?php echo $product_obj->get_permalink(); ?>" target="_blank"><?php echo $product_obj->get_title(); ?></a></td>
			<?php if ($product_obj->get_sku()) { ?>
			<td scope="col"><?php echo $product_obj->get_sku(); ?></td>
			<?php } else { ?>
				<td scope="col"><?php echo '-'; ?></td>
			<?php }?>
		</tr>
		<?php
		}
		?>
	</tbody>
</table>

<h3><?php esc_html_e( 'Customer Details', 'woocommerce-catalog-enquiry' ); ?></h3>
<p>
	<strong><?php esc_html_e( 'Name', 'woocommerce-catalog-enquiry' ); ?> : </strong>
	<?php echo $enquiry_data['user_name']; ?>
</p>
<p>
	<strong><?php esc_html_e( 'Email', 'woocommerce-catalog-enquiry' ); ?> : </strong>
	<a target="_blank" href="mailto:<?php echo $enquiry_data['user_email']; ?>"><?php echo $enquiry_data['user_email']; ?></a>
</p>

<table cellspacing="0" cellpadding="10" border="0" width="100%">
	<tbody>
		<tr>
			<td colspan="2" valign="middle" align="center">
			<p><?php echo apply_filters('woocommerce_catalog_enquiry_email_footer_text', sprintf( __( '%s - Powered by WC Catalog Enquiry', 'woocommerce-catalog-enquiry' ), get_bloginfo( 'name', 'display' ) ) );?></a>.</p>
			</td>
		</tr>
	</tbody>
</table>