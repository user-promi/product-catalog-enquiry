<?php
/**
 * Plugin Name: Product Catalog Enquiry
 * Plugin URI: https://multivendorx.com/
 * Description: Convert your WooCommerce store into a catalog website in a click
 * Author: MultiVendorX
 * Version: 5.0.7
 * Author URI: https://multivendorx.com/
 * WC requires at least: 4.2
 * WC tested up to: 8.5.2
 * Text Domain: woocommerce-catalog-enquiry
 * Domain Path: /languages/
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

require_once trailingslashit(dirname(__FILE__)).'config.php';
require_once __DIR__ . '/vendor/autoload.php';

function Catalog() {
    return \CatalogEnquiry\CatalogEnquiry::init(__FILE__);
}

Catalog();
