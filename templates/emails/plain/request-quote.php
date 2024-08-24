<?php
/**
 * Catalog Enquiry Pro Email Request quote (Plain Text)
 */

defined( 'ABSPATH' ) || exit; // Exit if accessed directly

echo "= " . sprintf( __( 'Dear %s', 'woocommerce-catalog-enquiry-pro' ), $admin ) . " =\n\n";
echo __( 'You have received a new quote request from a customer for the following product:', 'woocommerce-catalog-enquiry-pro' ) . "\n\n";

// Products Table
foreach ( $products as $item ) {
    $_product = wc_get_product( $item['product_id'] );
    echo sprintf( __( 'Product: %s', 'woocommerce-catalog-enquiry-pro' ), $_product->get_title() ) . "\n";
    echo sprintf( __( 'Qty: %s', 'woocommerce-catalog-enquiry-pro' ), $item['quantity'] ) . "\n\n";
}

echo "\n" . __( 'Customer Details:', 'woocommerce-catalog-enquiry-pro' ) . "\n";
echo __( 'Customer Name:', 'woocommerce-catalog-enquiry-pro' ) . ' ' . $customer_data['name'] . "\n";
echo __( 'Email:', 'woocommerce-catalog-enquiry-pro' ) . ' ' . $customer_data['email'] . "\n\n";

if ( ! empty( $customer_data['details'] ) ) {
    echo __( 'Additional Details:', 'woocommerce-catalog-enquiry-pro' ) . "\n";
    echo $customer_data['details'] . "\n";
}

do_action( 'woocommerce_email_footer', $email );
