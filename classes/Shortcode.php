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
    }

    function frontend_scripts() {

        $current_user = wp_get_current_user();
        if (Catalog()->modules->is_active('quote')) {
            wp_enqueue_script('quote_list_js', Catalog()->plugin_url . 'build/blocks/quote-cart/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n', 'wp-blocks' ], Catalog()->version, true);
            wp_localize_script(
                'quote_list_js', 'quote_cart', [
                'apiUrl' => untrailingslashit(get_rest_url()),
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'restUrl' => 'catalog/v1',
                'name'  => $current_user->display_name,
                'email' => $current_user->user_email
            ]);
            wp_enqueue_style('quote_list_css', Catalog()->plugin_url . 'build/blocks/quote-cart/index.css');
    
            wp_enqueue_script('quote_thank_you_js', Catalog()->plugin_url . 'build/blocks/quote-thank-you/index.js', [ 'wp-blocks', 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);
        }
    }

	function display_request_quote() {
        $this->frontend_scripts();
		ob_start();
        ?>
        <div id="request_quote_list">
        </div>
        <?php
		return ob_get_clean();
	}
    
    function display_request_quote_thank_you() {
        $this->frontend_scripts();
        ob_start();
        ?>
        <div id="quote_thank_you_page">
        </div>
        <?php
        return ob_get_clean();
    }

} 