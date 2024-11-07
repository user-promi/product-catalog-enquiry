<?php 

namespace CatalogEnquiry\Enquiry;

use CatalogEnquiry\CatalogEnquiry;
use CatalogEnquiry\Utill;

class Frontend{
    /**
     * Frontend class constructor function.
     */
    public function __construct() {
        // Check the exclution
        if ( ! Util::is_available() ) return;

        $display_enquiry_button = Catalog()->setting->get_setting( 'enquiry_user_permission' );
        if (in_array('enquiry_logged_out', $display_enquiry_button) && !is_user_logged_in()) {
            return;
        }

        if ( ! empty( Catalog()->setting->get_setting( 'is_hide_cart_checkout' ) ) ) {
            add_action( 'woocommerce_after_shop_loop_item', [$this, 'add_button_in_shop_page'] );
        }

        add_action( 'display_shop_page_button', [ $this, 'add_enquiry_button' ] );

        add_action( 'woocommerce_single_product_summary', [ $this, 'enquiry_button_exclusion' ], 5);

        add_action( 'wp_enqueue_scripts', [ $this, 'frontend_scripts' ] );

        // Enquiry button shortcode
        add_shortcode( 'wce_enquiry_button', [ $this, 'wce_enquiry_button_shortcode' ] );

    }

    /**
     * Add enquiry button
     * @return void
     */
    public function add_enquiry_button() {
        global $post, $product;
        if ( Catalog()->setting->get_setting( 'is_enable_multiple_product_enquiry' ) && Utill::is_pro_active() ) {
            return;
        }
        $product        = wc_get_product($post->ID);
        $current_user   = wp_get_current_user();
        $settings_array = Catalog()->setting->get_setting( 'enquery_button' );
        $settings_array = is_array($settings_array) ? $settings_array : [];

        $form_settings =  Catalog()->setting->get_setting( 'form_customizer' );
        $form_settings = is_array( $form_settings ) ? $form_settings : [];

        $button_css = $button_onhover_style = "";
        $border_size = ( !empty( $settings_array[ 'button_border_size' ] ) ) ? esc_html( $settings_array[ 'button_border_size' ] ).'px' : '1px';
        if ( !empty( $settings_array[ 'button_background_color' ] ) )
            $button_css .= "background:" . esc_html( $settings_array[ 'button_background_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_text_color' ] ) )
            $button_css .= "color:" . esc_html( $settings_array[ 'button_text_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_border_color' ] ) )
            $button_css .= "border: " . $border_size . " solid " . esc_html( $settings_array[ 'button_border_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_font_size' ] ) )
            $button_css .= "font-size:" . esc_html( $settings_array[ 'button_font_size' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_border_radious' ] ) )
            $button_css .= "border-radius:" . esc_html( $settings_array[ 'button_border_radious' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_font_width' ] ) )
            $button_css .= "font-weight:" . esc_html( $settings_array[ 'button_font_width' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_padding' ] ) )
            $button_css .= "padding:" . esc_html( $settings_array[ 'button_padding' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_margin' ] ) )
            $button_css .= "margin:" . esc_html( $settings_array[ 'button_margin' ] ) . "px;";

        if ( isset( $settings_array[ 'button_background_color_onhover' ] ) )
            $button_onhover_style .= !empty( $settings_array[ 'button_background_color_onhover' ] ) ? 'background: ' . $settings_array[ 'button_background_color_onhover' ] . ' !important;' : '';
        if ( isset( $settings_array[ 'button_text_color_onhover' ] ) )
            $button_onhover_style .= !empty( $settings_array[ 'button_text_color_onhover' ] ) ? ' color: ' . $settings_array[ 'button_text_color_onhover' ] . ' !important;' : '';
        if ( isset( $settings_array[ 'button_border_color_onhover' ] ) )
            $button_onhover_style .= !empty( $settings_array[ 'button_border_color_onhover' ] ) ? 'border: ' . $border_size . ' solid' . $settings_array[ 'button_border_color_onhover' ] . ' !important;' : '';
        if ( $button_onhover_style ) {
            echo '<style>
                .woocommerce-catalog-enquiry-btn:hover{
                '. esc_html( $button_onhover_style ) .'
                } 
            </style>';
        } 
        $settings_array[ 'button_text' ] = !empty( $settings_array[ 'button_text' ] ) ? $settings_array[ 'button_text' ] : \CatalogEnquiry\Utill::get_translated_string( 'woocommerce-catalog-enquiry', 'send_an_enquiry', 'Send an enquiry' );
        $button_position_settings = Catalog()->setting->get_setting( 'shop_page_button_position_setting' );
        $button_position_settings = is_array($button_position_settings) ? $button_position_settings : [];
        $position = array_search('enquery_button', $button_position_settings);
        $position = $position !== false ? $position : 0;

        ?>
        <div id="woocommerce-catalog" name="woocommerce_catalog">
        <?php 
            if (Catalog()->setting->get_setting( 'is_enable_out_of_stock' ) ){
                if ( !$product->managing_stock() && !$product->is_in_stock()) { ?>
                <div position = "<?php echo $position; ?>">
                    <button class="woocommerce-catalog-enquiry-btn button demo btn btn-primary btn-large" style="<?php echo $button_css; ?>" href="#catalog-modal"><?php echo esc_html( $settings_array[ 'button_text' ] ); ?></button>
                </div>
                <?php
                }
        } else { ?>
                <div position = "<?php echo $position; ?>">
                    <button class="woocommerce-catalog-enquiry-btn button demo btn btn-primary btn-large" style="<?php echo $button_css; ?>" href="#catalog-modal"><?php echo esc_html( $settings_array[ 'button_text' ] ); ?></button>
                </div>
                <?php
            }
             ?>
            <input type="hidden" name="product_name_for_enquiry" id="product-name-for-enquiry" value="<?php echo get_post_field('post_title', $post->ID); ?>" />
            <input type="hidden" name="product_url_for_enquiry" id="product-url-for-enquiry" value="<?php echo get_permalink($post->ID); ?>" />
            <input type="hidden" name="product_id_for_enquiry" id="product-id-for-enquiry" value="<?php echo $post->ID; ?>" />
            <input type="hidden" name="enquiry_product_type" id="enquiry-product-type" value="<?php
                if ($product && $product->is_type('variable')) {
                    echo 'variable';
                }
                ?>" />
            <input type="hidden" name="user_id_for_enquiry" id="user-id-for-enquiry" value="<?php echo $current_user->ID; ?>" />  			
        </div>
        <div id="catalog-modal" style="display: none;" class="catalog-modal <?php echo (Catalog()->setting->get_setting( 'is_disable_popup' ) == 'popup') ? 'popup_enable' : '' ?>">
        </div>	
        <?php
    }

    /**
     * Enquiry button exclusion
     * @return void
     */
    public function enquiry_button_exclusion() { 
        global $post;
        
        if ( ! Util::is_available_for_product( $post->ID ) ) {
            remove_action( 'display_shop_page_button', [ $this, 'add_enquiry_button' ] );
        } else {
            add_action( 'display_shop_page_button', [ $this, 'add_enquiry_button' ] );

        }
    }

    /**
     * Enqueue script
     * @return void
     */
    public function frontend_scripts() {
        global $post;

        if (is_product() || has_shortcode($post->post_content, 'catalog_enquiry_cart') || has_block('woocommerce-catalog-enquiry-pro/enquiry-cart') || has_block('woocommerce-catalog-enquiry/enquiry-button')) {
            $current_user = wp_get_current_user();

            wp_enqueue_style( 'mvx-catalog-product-style', Catalog()->plugin_url . '/build/blocks/enquiryForm/index.css' );
            // additional css
            $additional_css_settings = Catalog()->setting->get_setting( 'custom_css_product_page' );
            if (isset($additional_css_settings) && !empty($additional_css_settings)) {
                wp_add_inline_style('mvx-catalog-product-style', $additional_css_settings);
            }
            
            wp_enqueue_script( 'frontend_js', Catalog()->plugin_url . 'modules/Enquiry/assets/js/frontend.js', [ 'jquery', 'jquery-blockui' ], Catalog()->version, true );
            wp_enqueue_script('enquiry_form_js', Catalog()->plugin_url . 'build/blocks/enquiryForm/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n', 'wp-blocks', 'wp-hooks' ], Catalog()->version, true );
            wp_localize_script(
                'enquiry_form_js', 'enquiry_form_data', [
                'apiurl'        => untrailingslashit(get_rest_url()),
                'nonce'         => wp_create_nonce( 'wp_rest' ),
                'settings_free' => $this->catalog_free_form_settings(),
                'settings_pro'  => $this->catalog_pro_form_settings(),
                'pro_active'    => \CatalogEnquiry\Utill::is_pro_active(),
                'product_data'  => (\CatalogEnquiry\Utill::is_pro_active() && !empty(Catalog_PRO()->cart->get_cart_data())) ? Catalog_PRO()->cart->get_cart_data() : '',
                'default_placeholder'  => [
                    'name'  => $current_user->display_name,
                    'email' => $current_user->user_email
                ],
                'content_before_form' => apply_filters('catalog_add_content_before_form', ''),
                'content_after_form'  => apply_filters('catalog_add_content_after_form', ''),
            ]);
        }
    }

    public function catalog_free_form_settings() {
        $form_settings = get_option( 'catalog_enquiry_form_customization_settings', [] );
    
        if ( function_exists( 'icl_t' ) ) {
            foreach ( $form_settings['freefromsetting'] as &$free_field ) {
                if ( isset( $free_field['label'] ) ) {
                    $free_field['label'] = icl_t( 'woocommerce-catalog-enquiry', 'free_form_label_' . $free_field['key'], $free_field['label'] );
                }
            }
        }
        
        return $form_settings['freefromsetting'];
    }

    public function catalog_pro_form_settings() {
        $form_settings = get_option( 'catalog_enquiry_form_customization_settings', [] );
    
        if ( function_exists( 'icl_t' ) ) {
            foreach ( $form_settings['formsettings']['formfieldlist'] as &$field ) {
                if ( isset( $field['label'] ) ) {
                    $field['label'] = icl_t( 'woocommerce-catalog-enquiry', 'form_field_label_' . $field['id'], $field['label'] );
                }
                if ( isset( $field['placeholder'] ) ) {
                    $field['placeholder'] = icl_t( 'woocommerce-catalog-enquiry', 'form_field_placeholder_' . $field['id'], $field['placeholder'] );
                }
                if ( isset( $field['options'] ) ) {
                    foreach ( $field['options'] as &$option ) {
                        $option['label'] = icl_t( 'woocommerce-catalog-enquiry', 'form_field_option_' . $field['id'] . '_' . $option['value'], $option['label'] );
                    }
                }
            }
        }

        return $form_settings[ 'formsettings' ];
    }

    /**
     * enquiry button shortcode
     * @return void
     */
    public function wce_enquiry_button_shortcode() {
        ob_start();
        remove_action('display_shop_page_button', [ $this, 'add_enquiry_button' ]);
        $this->add_enquiry_button();
        return ob_get_clean();
    }

    /**
     * Add enquiry button in shop page
     * @return void
     */
    function add_button_in_shop_page() {
        global $product;
        if ( ! Util::is_available_for_product( $product->get_id() ) ) {
            return;
        }

        if ( Catalog()->setting->get_setting( 'is_enable_multiple_product_enquiry' ) && Utill::is_pro_active() ) {
            return;
        }

        $settings_array = Catalog()->setting->get_setting( 'enquery_button' );
        $settings_array = is_array($settings_array) ? $settings_array : [];
        $button_css = $button_onhover_style = "";
        $border_size = ( !empty( $settings_array[ 'button_border_size' ] ) ) ? esc_html( $settings_array[ 'button_border_size' ] ).'px' : '1px';
        if ( !empty( $settings_array[ 'button_background_color' ] ) )
            $button_css .= "background:" . esc_html( $settings_array[ 'button_background_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_text_color' ] ) )
            $button_css .= "color:" . esc_html( $settings_array[ 'button_text_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_border_color' ] ) )
            $button_css .= "border: " . $border_size . " solid " . esc_html( $settings_array[ 'button_border_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_font_size' ] ) )
            $button_css .= "font-size:" . esc_html( $settings_array[ 'button_font_size' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_border_radious' ] ) )
            $button_css .= "border-radius:" . esc_html( $settings_array[ 'button_border_radious' ] ) . "px;";

        if ( isset( $settings_array[ 'button_background_color_onhover' ] ) )
            $button_onhover_style .= !empty( $settings_array[ 'button_background_color_onhover' ] ) ? 'background: ' . $settings_array[ 'button_background_color_onhover' ] . ' !important;' : '';
        if ( isset( $settings_array[ 'button_text_color_onhover' ] ) )
            $button_onhover_style .= !empty( $settings_array[ 'button_text_color_onhover' ] ) ? ' color: ' . $settings_array[ 'button_text_color_onhover' ] . ' !important;' : '';
        if ( isset( $settings_array[ 'button_border_color_onhover' ] ) )
            $button_onhover_style .= !empty( $settings_array[ 'button_border_color_onhover' ] ) ? 'border: ' . $border_size . ' solid' . $settings_array[ 'button_border_color_onhover' ] . ' !important;' : '';
        if ( $button_onhover_style ) {
            echo '<style>
                .single_add_to_cart_button:hover{
                '. esc_html( $button_onhover_style ) .'
                } 
            </style>';
        } 
        $button_text = !empty( $settings_array[ 'button_text' ] ) ? $settings_array[ 'button_text' ] : \CatalogEnquiry\Utill::get_translated_string( 'woocommerce-catalog-enquiry', 'send_an_enquiry', 'Send an enquiry' );
        if ( is_shop() ) {
            global $product;
            $product_link = get_permalink( $product->get_id() );
            echo '<a href="' . esc_url( $product_link ) . '" class="single_add_to_cart_button button" style="' . esc_attr( $button_css ) . '">' . esc_html( $button_text ) . '</a>';
        }
    }
}