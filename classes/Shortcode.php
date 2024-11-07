<?php

namespace CatalogEnquiry;

class Shortcode {
    /**
     * Shortcode class construct function
     */
	public function __construct() {
		//For quote page
		add_shortcode( 'request_quote', [ $this, 'display_request_quote' ] );
        //For quote thank you page
		add_shortcode( 'request_quote_thank_you', [ $this, 'display_request_quote_thank_you' ] );
        
        //enqueue script
        add_action( 'wp_enqueue_scripts', [ $this, 'frontend_scripts'] );

    }

    function frontend_scripts() {
        global $post;

        if (has_shortcode($post->post_content, 'request_quote') || has_block('woocommerce-catalog-enquiry/quote-cart')) {
            wp_enqueue_script('quote_list_js', Catalog()->plugin_url . 'build/blocks/quoteListTable/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n', 'wp-blocks' ], Catalog()->version, true);
            wp_localize_script(
                'quote_list_js', 'appLocalizer', [
                'apiurl' => untrailingslashit(get_rest_url()),
                'nonce' => wp_create_nonce( 'wp_rest' ),
            ]);
            wp_enqueue_style('quote_list_css', Catalog()->plugin_url . 'build/blocks/quoteListTable/index.css');
        }

        if (has_shortcode($post->post_content, 'request_quote_thank_you')) {
            wp_enqueue_script('quote_thank_you_js', Catalog()->plugin_url . 'build/blocks/quoteThankyou/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);
        }
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
    
    function display_request_quote_thank_you() {
        ob_start();
        ?>
        <div id="quote_thank_you_page">
        </div>
        <?php
        return ob_get_clean();
    }

} 