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
        // add_action( 'wp_enqueue_scripts', [ $this, 'frontend_scripts'] );

    }

    function frontend_scripts() {

        if (Catalog()->modules->is_active('quote')) {
            wp_enqueue_script('quote_list_js', Catalog()->plugin_url . 'build/blocks/quote-cart/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n', 'wp-blocks' ], Catalog()->version, true);
            wp_localize_script(
                'quote_list_js', 'quote_cart', [
                'apiUrl' => untrailingslashit(get_rest_url()),
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'restUrl' => 'catalog/v1',
            ]);
            wp_enqueue_style('quote_list_css', Catalog()->plugin_url . 'build/blocks/quote-cart/index.css');
    
            wp_enqueue_script('quote_thank_you_js', Catalog()->plugin_url . 'build/blocks/quote-thank-you/index.js', [ 'wp-blocks', 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);
        }


        // if (isset( $post->post_content ) && has_shortcode($post->post_content, 'request_quote') || has_block('woocommerce-catalog-enquiry/quote-cart')) {
        //     wp_enqueue_script('quote_list_js');
        //     wp_enqueue_style('quote_list_css');
        // }

        // if (isset( $post->post_content ) && has_shortcode($post->post_content, 'request_quote_thank_you')) {
        //     wp_enqueue_script('quote_thank_you_js');
        // }
    }

	function display_request_quote() {
		ob_start();
        // $args = Catalog()->quotecart->get_cart_data();
		// Catalog()->util->get_template( 'shortcode/request-quote.php', $args );
        // wp_enqueue_script('quote_list_js');
        // wp_enqueue_style('quote_list_css');
        $this->frontend_scripts();
        ?>
        <div id="request_quote_list">
        </div>
        <?php
		return ob_get_clean();
	}
    
    function display_request_quote_thank_you() {
        ob_start();
        // wp_enqueue_script('quote_thank_you_js');
        $this->frontend_scripts();

        ?>
        <div id="quote_thank_you_page">
        </div>
        <?php
        return ob_get_clean();
    }

} 