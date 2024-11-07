<?php
/**
 * Catalog Enquiry Email Request quote
 */

 defined( 'ABSPATH'  ) || exit; // Exit if accessed directly

do_action( 'woocommerce_email_header', $email_heading  ); ?>

<div class="email-container">
    <h1><?php printf( __( 'Dear %s', 'woocommerce-catalog-enquiry-pro' ), $admin ); ?></h1>
    <p><?php _e( 'You have received a new quote request from a customer for the following product:', 'woocommerce-catalog-enquiry-pro' ); ?></p>
    
    <div class="table-wrapper">
        <table cellspacing="0" cellpadding="6" style="width: 100%; border: 1px solid #eee;" border="1" bordercolor="#eee">
            <thead>
                <tr>
                    <th scope="col"style="text-align:<?php echo esc_attr( $text_align ); ?>; border: 1px solid #eee;">
                        <?php esc_html_e( 'Product', 'woocommerce-catalog-enquiry-pro');?>
                    </th>
                    <th scope="col" style="text-align:center; border: 1px solid #eee;">
                        <?php esc_html_e( 'Qty', 'woocommerce-catalog-enquiry-pro'); ?>
                    </th>
                </tr>
            </thead>

            <tbody>
            <?php
                foreach ( $products as $item  ) {
                    $_product = wc_get_product( $item['product_id'] );
                ?>
                <tr>
                    <td class="product_name">
                    <a href="<?php echo esc_url( $_product->get_permalink() ); ?>"><?php echo $_product->get_title(); ?></a>
                    </td>
                    <td class="product_quantity">
                        <?php echo esc_html( $item['quantity'] ); ?>
                    </td>
                </tr>
                <?php 
                } ?>
            </tbody>
        </table>
        <br>
    </div>
    <div class="details">
        <p><strong><?php _e( 'Customer Name:', 'woocommerce-catalog-enquiry-pro' ); ?></strong> <?php echo esc_html( $customer_data['name'] ); ?></p>
        <p><strong><?php _e('Email:', 'woocommerce-catalog-enquiry-pro'); ?></strong> 
        <a href="mailto:<?php echo esc_attr($customer_data['email']); ?>">
            <?php echo esc_html($customer_data['email']); ?>
        </a></p>

        <p><strong><?php _e('Additional Details:', 'woocommerce-catalog-enquiry-pro'); ?></strong><br>
            <?php echo nl2br(esc_html($customer_data['details'])); ?>
        </p>

    </div>
</div>

<?php do_action( 'woocommerce_email_footer', $email ); ?>
