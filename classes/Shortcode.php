<?php

namespace CatalogEnquiry;

use CatalogEnquiry\wholesale\Util;

class Shortcode {
    /**
     * Shortcode class construct function
     */
	public function __construct() {
		//For quote page
		add_shortcode( 'request_quote', [ $this, 'display_request_quote' ] );
        //For quote thank you page
		add_shortcode( 'request_quote_thank_you', [ $this, 'display_request_quote_thank_you' ] );
        //for wholesale
        add_shortcode( 'wholesale_product_list', [ $this, 'display_wholesale_product_list' ] );

        //enqueue script
        add_action( 'wp_enqueue_scripts', [ $this, 'frontend_scripts'] );

        // Hook the function to template_redirect
        add_action( 'template_redirect', [ $this, 'wholesale_shop_page_redirect' ]);
    }

    function wholesale_shop_page_redirect() {
        // Redirect to shop page if the user is not a wholesale user
        if (is_page('wholesale-product-list') && !Util::is_wholesale_user() ) {
            // Redirect to the shop page if the user is not a wholesale user
            wp_redirect( get_permalink( get_option('woocommerce_shop_page_id') ) );
            exit;
        }
    }


    function frontend_scripts() {
        wp_enqueue_script('product_list_js', Catalog()->plugin_url . 'build/blocks/wholesaleProductList/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);
        wp_enqueue_style('product_list_css', Catalog()->plugin_url . 'build/blocks/wholesaleProductList/index.css');

        $products = wc_get_products([
            'meta_key'   => 'wholesale_product',
            'meta_value' => 'yes',
            'return' => 'ids',
            'limit' => -1
        ]);

        wp_localize_script(
            'product_list_js', 'appLocalizer', [
            'apiurl' => untrailingslashit(get_rest_url()),
            'nonce' => wp_create_nonce( 'wp_rest' ),
            'cart_nonce' => wp_create_nonce( 'wc_store_api' ),
            'pro_active' => Utill::is_pro_active(),
            'products' => $products,
        ]);

        wp_enqueue_script('quote_list_js', Catalog()->plugin_url . 'build/blocks/quoteListTable/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);
        wp_enqueue_style('quote_list_css', Catalog()->plugin_url . 'build/blocks/quoteListTable/index.css');
        wp_enqueue_script('quote_thank_you_js', Catalog()->plugin_url . 'build/blocks/quoteThankYou/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);

    }

	function display_request_quote() {
		ob_start();
        // $args = Catalog()->quotecart->get_cart_data();
		// Catalog()->util->get_template( 'shortcode/request-quote.php', $args );
        ?>
        <div id="request_quote_list">
        </div>
        <?php
		return ob_get_clean();
	}

    function display_wholesale_product_list() {
        // Start output buffering to capture the output
        ob_start();
        ?>
        <div id="wholesale_product_list">
        </div>
        <?php
    
        // Return the captured output
        return ob_get_clean();
    }
    


    function display_request_quote_thank_you() {
        ob_start();
        ?>
        <div id="quote_thank_you_page">
        </div>
        <?php
        return ob_get_clean();
    }
} 