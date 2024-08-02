<?php

namespace CatalogEnquiry\Quote;

use CatalogEnquiry\Utill;

class Frontend {
    /**
     * Frontend class constructor functions
     */
    public function __construct() {
        $display_quote_button = Catalog()->setting->get_setting( 'quote_user_permission' );
        if (!$display_quote_button && !is_user_logged_in()) {
            return;
        }
        add_action ('display_shop_page_button', [ $this, 'add_button_for_quote'] );
        add_action('woocommerce_after_shop_loop_item', [$this, 'add_button_for_quote'], 11 );
        //exclusion
        add_action( 'woocommerce_single_product_summary', [$this, 'catalog_woocommerce_template_single'], 5 );

        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Enqueue frontend js
     * @return void
     */
    public function enqueue_scripts() {
        $frontend_script_path = Catalog()->plugin_url . 'modules/quote/js/';
        $frontend_script_path = str_replace( [ 'http:', 'https:' ], '', $frontend_script_path );

        wp_enqueue_script('add_to_quote_js', $frontend_script_path . 'add-to-quote-cart.js', ['jquery'], Catalog()->version, true);
        wp_localize_script(
            'add_to_quote_js',
            'quote_cart',
            [
                'ajaxurl' => admin_url('admin-ajax.php'),
                'loader' => admin_url('images/wpspin_light.gif'),
                'no_more_product' => __('No more product in Quote list!', 'woocommerce-catalog-enquiry-pro'),
            ]
        );
    }

    /**
     * add quote button in single product page and shop page
     */
    function add_button_for_quote() {

        global $product;
        $quote_btn_text = Utill::get_translated_string( 'woocommerce-catalog-enquiry', 'add_to_quote', 'Add to Quote' );    
        $view_quote_btn_text = Utill::get_translated_string( 'woocommerce-catalog-enquiry', 'view_quote', 'View Quote' ); 
        $btn_style = '';

        $settings_array = Catalog()->setting->get_setting( 'quote_button' );
        $btn_style = "";
        $border_size = ( !empty( $settings_array[ 'button_border_size' ] ) ) ? esc_html( $settings_array[ 'button_border_size' ] ).'px' : '1px';
        if ( !empty( $settings_array[ 'button_background_color' ] ) )
            $btn_style .= "background:" . esc_html( $settings_array[ 'button_background_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_text_color' ] ) )
            $btn_style .= "color:" . esc_html( $settings_array[ 'button_text_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_border_color' ] ) )
            $btn_style .= "border: " . $border_size . " solid " . esc_html( $settings_array[ 'button_border_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_font_size' ] ) )
            $btn_style .= "font-size:" . esc_html( $settings_array[ 'button_font_size' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_border_radious' ] ) )
            $btn_style .= "border-radius:" . esc_html( $settings_array[ 'button_border_radious' ] ) . "px;";
            $button_onhover_style = $border_size = '';
            $border_size = ( !empty( $settings_array[ 'button_border_size' ] ) ) ? $settings_array[ 'button_border_size' ].'px' : '1px';
    
            if ( isset( $settings_array[ 'button_background_color_onhover' ] ) )
                $button_onhover_style .= !empty( $settings_array[ 'button_background_color_onhover' ] ) ? 'background: ' . $settings_array[ 'button_background_color_onhover' ] . ' !important;' : '';
            if ( isset( $settings_array[ 'button_text_color_onhover' ] ) )
                $button_onhover_style .= !empty( $settings_array[ 'button_text_color_onhover' ] ) ? ' color: ' . $settings_array[ 'button_text_color_onhover' ] . ' !important;' : '';
            if ( isset( $settings_array[ 'button_border_color_onhover' ] ) )
                $button_onhover_style .= !empty( $settings_array[ 'button_border_color_onhover' ] ) ? 'border: ' . $border_size . ' solid' . $settings_array[ 'button_border_color_onhover' ] . ' !important;' : '';
            if ( $button_onhover_style ) {
                echo '<style>
                    .add-request-quote-button:hover{
                    '. esc_html( $button_onhover_style ) .'
                    } 
                </style>';
            } 
        
        Catalog()->util->get_template('quote-button-template.php',
        [
            'class'             => 'add-request-quote-button ',
            'btn_style'         => $btn_style,
            'wpnonce'           => wp_create_nonce( 'add-quote-' . $product->get_id() ),
            'product_id'        => $product->get_id(),
            'label'             => $quote_btn_text,
            'label_browse'      => $view_quote_btn_text,
            'rqa_url'           => Catalog()->quotecart->get_request_quote_page_url(),
            'exists'            => Catalog()->quotecart->exists_in_cart( $product->get_id() )
        ]);
    }

    /**
     * Exclusion in single product page
     */
    function catalog_woocommerce_template_single() { 
        global $post;
        if ( !Util::is_available_for_product($post->ID)) {
            remove_action( 'display_shop_page_button', [ $this, 'add_button_for_quote'] );
        } else {
            add_action( 'display_shop_page_button', [ $this, 'add_button_for_quote'] );

        }
    }
}