<?php 
namespace CatalogEnquiry\catalog;
use CatalogEnquiry\Utill;
class Module {
    public $available_for;
    public function __construct() {
        $this->available_for = '';
        $current_user = wp_get_current_user();
        $catalog_user_role_restriction = Catalog()->setting->get_option('catalog_enquiry_quote_exclusion_settings');
        if (isset($settings['catalog_exclusion_userroles_list'])) {
            foreach ($catalog_user_role_restriction['catalog_exclusion_userroles_list'] as $user_list_key) {
                $user_role_list[] = in_array( $user_list_key['key'], array_keys( wp_roles()->roles ) ) ? $user_list_key['key'] : '';
            }
            if ( !empty( $current_user->roles ) && !empty( $user_role_list ) && in_array($current_user->roles[0], $user_role_list)) {
                $this->available_for = $current_user->ID;
            }
        }
        if (isset($settings['catalog_exclusion_user_list'])) {
            foreach ($catalog_user_role_restriction['catalog_exclusion_user_list'] as $user_list_key) {
                if ($current_user->ID == intval($user_list_key['key'])) {
                    $this->available_for = $current_user->ID;                           
                }
            }
        }

        add_action('init', [$this, 'main' ], 99);
    }

    function main() {

        if ($this->available_for == '') {
            remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);
            remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
            remove_action('woocommerce_single_variation', 'woocommerce_single_variation_add_to_cart_button', 20);
            add_action('template_redirect', [$this, 'redirect_cart_checkout_page' ], 10);

            add_action('woocommerce_single_product_summary', [$this, 'display_description_box'], 40);
            // add_action('woocommerce_single_product_summary', [$this, 'display_button'], 35);
            add_action('woocommerce_single_product_summary', [$this, 'add_variation_product'], 29);

            $position_settings = Catalog()->setting->get_setting( 'shop_page_possition_setting' );
            // file_put_contents( plugin_dir_path(__FILE__) . "/error.log", date("d/m/Y H:i:s", time()) . ":position_settings:  : " . var_export($position_settings['additional_input'], true) . "\n", FILE_APPEND);

            if ($position_settings['additional_input'] == '') {
                add_action('woocommerce_single_product_summary', [$this, 'display_description_box'], 6);
            } elseif ($position_settings['additional_input'] == 'price_section') {
                add_action('woocommerce_single_product_summary', [$this, 'display_description_box'], 10);
            } elseif ($position_settings['additional_input'] == 'product_description') {
                add_action('woocommerce_single_product_summary', [$this, 'display_description_box'], 35);
            } elseif ($position_settings['additional_input'] == 'sku_category') {
                add_action('woocommerce_single_product_summary', [$this, 'display_description_box'], 40);
            }
            // add_action('woocommerce_before_shop_loop_item', [$this, 'change_permalink_url_for_selected_product'], 5);

            add_action('woocommerce_after_shop_loop_item_title' , [$this, 'price_for_selected_product'], 5);
            add_action('woocommerce_after_shop_loop_item' , array ($this, 'add_to_cart_button_for_selected_product'),5);
            add_action( 'woocommerce_single_product_summary', array($this, 'catalog_woocommerce_template_single'), 5 );

            $price_hide_product_page = Catalog()->setting->get_setting( 'is_hide_product_price' );
            if ( $price_hide_product_page ) {
                remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
                remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
            }
        }
    }

    public function price_for_selected_product() { 
        global $post;
        $settings = Catalog()->setting->get_option('catalog_enquiry_quote_exclusion_settings');      

        $product_for = [];
        foreach ($settings['catalog_exclusion_product_list'] as $user_list_key) {
            if ($post->ID == $user_list_key['key']) {
                $product_for[] = $post->ID;
            }
        }

        $category_for = [];
        $term_list = wp_get_post_terms($post->ID,'product_cat',array('fields'=>'ids'));
        foreach ($settings['catalog_exclusion_category_list'] as $user_list_key) {
            if ($user_list_key['key'] == $term_list[0]) {
                $category_for[] = $post->ID;
            }
        }

        $tag_for = [];
        $tag_term_list = wp_get_post_terms($post->ID,'product_tag',array('fields'=>'ids'));
        foreach ($settings['catalog_exclusion_tag_list'] as $user_list_key) {
            if ($user_list_key['key'] == $tag_term_list[0]) {
                $tag_for[] = $post->ID;
            }
        }

        if (in_array($post->ID, $product_for) || in_array($post->ID, $category_for) || in_array($post->ID, $tag_for)) {
            add_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);
        } else {
            remove_action('woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10);
        }
        
    }

    public function add_to_cart_button_for_selected_product() {
        global $post;
        $settings = Catalog()->setting->get_option('catalog_enquiry_quote_exclusion_settings');      

        $product_for = [];

        foreach ($settings['catalog_exclusion_product_list'] as $user_list_key) {
            if ($post->ID == $user_list_key['key']) {
                $product_for[] = $post->ID;
            }
        }           
        
        $category_for = [];
        $term_list = wp_get_post_terms($post->ID,'product_cat',array('fields'=>'ids'));
        foreach ($settings['catalog_exclusion_category_list'] as $user_list_key) {
            if ($user_list_key['key'] == $term_list[0]) {
                $category_for[] = $post->ID;
            }
        }

        $tag_for = [];
        $tag_term_list = wp_get_post_terms($post->ID,'product_tag',array('fields'=>'ids'));
        foreach ($settings['catalog_exclusion_tag_list'] as $user_list_key) {
            if ($user_list_key['key'] == $tag_term_list[0]) {
                $tag_for[] = $post->ID;
            }
        }

        if (in_array($post->ID, $product_for) || in_array($post->ID, $category_for) || in_array($post->ID, $tag_for)) {
            // add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );  
        } 
        else {
            remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );  
        }
    }

    public function catalog_woocommerce_template_single() { 
        global $post;
        $settings = Catalog()->setting->get_option('catalog_enquiry_quote_exclusion_settings');      

        $product_for = [];
        if (isset($settings['catalog_exclusion_product_list'])) {
            foreach ($settings['catalog_exclusion_product_list'] as $user_list_key) {
                if ($post->ID == $user_list_key['key']) {
                    $product_for[] = $post->ID;
                }
            }   
        } 

        $category_for = [];
        $term_list = wp_get_post_terms($post->ID,'product_cat',array('fields'=>'ids'));
        if (isset($settings['catalog_exclusion_category_list'])) {
            foreach ($settings['catalog_exclusion_category_list'] as $user_list_key) {
                if ($user_list_key['key'] == $term_list[0]) {
                    $category_for[] = $post->ID;
                }
            }
        }

        $tag_for = [];
        $tag_term_list = wp_get_post_terms($post->ID,'product_tag',array('fields'=>'ids'));
        if (isset($settings['catalog_exclusion_tag_list'])) {
            foreach ($settings['catalog_exclusion_tag_list'] as $user_list_key) {
                if ($user_list_key['key'] == $tag_term_list[0]) {
                    $tag_for[] = $post->ID;
                }
            }
        }

        if (in_array($post->ID, $product_for) || in_array($post->ID, $category_for) || in_array($post->ID, $tag_for)) {
            add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
            add_action( 'woocommerce_single_variation', 'woocommerce_single_variation', 10 );           
            // add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
            add_action( 'woocommerce_single_variation', 'woocommerce_single_variation_add_to_cart_button', 20 ); 
            remove_action('woocommerce_single_product_summary', [$this, 'display_description_box'], 35);
        } else {
            remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
            remove_action( 'woocommerce_single_variation', 'woocommerce_single_variation', 10 );           
            remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
            remove_action( 'woocommerce_single_variation', 'woocommerce_single_variation_add_to_cart_button', 20 );   
        }
    }

    function add_variation_product() {

        global $product;
        if ($product->is_type('variable')) {
            $variable_product = new \WC_Product_Variable($product);
            // Enqueue variation scripts
            wp_enqueue_script('wc-add-to-cart-variation');
            $available_variations = $variable_product->get_available_variations();
            $args = [
                'available_variations' => $available_variations
            ];
            //attributes
            Catalog()->util->get_template('woocommerce-catalog-enquiry-variable-product.php', $args);

        } elseif ($product->is_type('simple')) {
            echo wc_get_stock_html($product);
        }
    }


    function redirect_cart_checkout_page() {
        $disable_cart_checkout = Catalog()->setting->get_setting( 'is_hide_cart_checkout' );
        $disable_cart_page_link = Catalog()->setting->get_setting( 'disable_cart_page_link' );
        if ($disable_cart_checkout) {
            $cart_page_id = wc_get_page_id('cart');
            $checkout_page_id = wc_get_page_id('checkout');
            if ( isset($disable_cart_page_link) ) {
                $home_url_link = get_permalink($disable_cart_page_link);
            } else {
                $home_url_link = apply_filters( 'woocommerce_redirect_to_home_url', home_url() );
            }
            if (is_page($cart_page_id) || is_page($checkout_page_id)) {
                wp_redirect($home_url_link);
                exit;
            }
        }
    }

    function display_description_box() {
        $desc_box = Catalog()->setting->get_setting( 'description_box' );
        ?>
        <div class="desc-box">
            <input type="text" id="desc-box" name="desc_box" value= "<?php echo $desc_box; ?>" readonly>
        </div>
        <?php
    }

    function display_button() {
        $settings_array = Utill::get_form_settings_array();
        $button_css = $button_href = "";
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
        if ($settings_array[ 'button_link' ]) {
            $button_href = $settings_array[ 'button_link' ] ;
        }
        // '. $button_href.'
        $button_html = '<button style="' . $button_css .'" class="" name="customize_button" onclick="window.location.href=\'' . esc_url($button_href) . '\'">' . esc_html( $settings_array[ 'button_text' ] ) . '</button>';
        echo $button_html;
    }
    
}

?>