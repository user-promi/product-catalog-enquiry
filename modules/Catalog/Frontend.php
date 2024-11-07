<?php 

namespace CatalogEnquiry\Catalog;

class Frontend{
    /**
     * Frontend class constructor function.
     */
    public function __construct() {
        // Check the exclution
        if ( ! Util::is_available() ) return;
        // Remove add to cart button
        if ( ! empty( Catalog()->setting->get_setting( 'is_hide_cart_checkout' ) ) ) {
            remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
            remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
            remove_action( 'woocommerce_single_variation', 'woocommerce_single_variation_add_to_cart_button', 20 );
        }

        // Add variation option for variation product
        // add_action( 'woocommerce_single_product_summary', [ $this, 'add_variation_product' ], 29 );

        // Cart page redirect settings
        add_action( 'template_redirect', [ $this, 'redirect_cart_checkout_page' ], 10 );

        // Display single product page descrioption box 
        add_action( 'display_shop_page_description_box', [ self::class, 'show_description_box' ] );

        // Hooks for exclutions
        add_action( 'woocommerce_after_shop_loop_item_title' , [ $this, 'price_for_selected_product' ] , 5 );
        add_action( 'woocommerce_after_shop_loop_item' , [ $this, 'add_to_cart_button_for_selected_product' ], 5 );
        add_action( 'woocommerce_single_product_summary', [ $this, 'catalog_woocommerce_template_single' ], 5 );

        $this->register_description_box();
    }

    /**
     * Add variation in single product page.
     * @return void
     */
    public function add_variation_product() {
        global $product;

        if ( $product->is_type( 'variable' ) ) {
            $variable_product = new \WC_Product_Variable( $product );
            
            // Enqueue variation scripts
            wp_enqueue_script('wc-add-to-cart-variation');
            
            $available_variations = $variable_product->get_available_variations();
            
            Catalog()->util->get_template('variable-product.php', [
                'available_variations' => $available_variations
            ]);

        } 
        // elseif ( $product->is_type( 'simple' ) ) {
        //     echo wc_get_stock_html( $product );
        // }
    }
    
    /**
     * Redirect cart and checkout page to home page
     * @return void
     */
    public static function redirect_cart_checkout_page() {

        // Get setting for disable bying
        $disable_bying = Catalog()->setting->get_setting( 'is_hide_cart_checkout' );

        // Check disable bying setting is enable or not
        if ( ! $disable_bying ) return;

        // Get force redirected url
        $redirect_url = Catalog()->setting->get_setting( 'disable_cart_page_link' );

        /**
         * Filter for redirect url
         * @var mixed
         */
        $redirect_url = apply_filters( 'catalog_cart_checkout_redirect_url', $redirect_url );

        // Get cart and checkout page id
        $cart_page_id       = wc_get_page_id( 'cart' );
        $checkout_page_id   = wc_get_page_id( 'checkout' );

        // Filter redirect url
        if ( ! empty( $redirect_url ) ) {
            $redirect_url = get_permalink( $redirect_url );
        } else {
            $redirect_url = apply_filters( 'woocommerce_redirect_to_home_url', home_url() );
        }

        // Redirect to redirect url if page is cart page or checkout page
        if ( is_page( $cart_page_id ) || is_page( $checkout_page_id ) ) {
            wp_redirect( $redirect_url );
            exit;
        }
    }

    /**
     * Display single product page descrioption box 
     * @return void
     */
    public static function show_description_box() {
        global $post;

        if ( ! Util::is_available_for_product( $post->ID  ) ) {
            return;
        }
        ?>
        <div class="desc-box">
            <?php $input_box = Catalog()->setting->get_setting( 'additional_input' );
            if ($input_box) { ?>
                <input type="text" id="desc-box" name="desc_box" value= "<?php echo $input_box; ?>" readonly>
            <?php } ?>
        </div>
        <?php
    }

    /**
     * Price exclusion for single product page
     * @return void
     */
    public function price_for_selected_product() { 
        global $post;
        $price_hide_product_page = Catalog()->setting->get_setting( 'hide_product_price' );
        if ( ! Util::is_available_for_product( $post->ID  ) && $price_hide_product_page ) {
        //     add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
        // } else {
            remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_price', 10 );
        }
    }

    /**
     * Shop page add to cart button exclusion
     * @return void
     */
    public function add_to_cart_button_for_selected_product() {
        global $post;

        if ( !Util::is_available_for_product($post->ID)) {
        //     add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );  
        // } 
        // else {
            if ( !empty(Catalog()->setting->get_setting( 'is_hide_cart_checkout' )) ) {   
                remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );  
            }
        }
    }

    /**
     * Single product page add to cart button exclusion
     * @return void
     */
    public function catalog_woocommerce_template_single() { 
        global $post;

        if ( !Util::is_available_for_product( $post->ID ) ) {
        //     $price_hide_product_page = Catalog()->setting->get_setting( 'hide_product_price' );
        //     if ( !$price_hide_product_page ) {
        //         add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
        //     }
        //     add_action( 'woocommerce_single_variation', 'woocommerce_single_variation', 10 );           
        //     add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
        //     add_action( 'woocommerce_single_variation', 'woocommerce_single_variation_add_to_cart_button', 20 ); 
        //     remove_action( 'display_shop_page_description_box', [$this, 'show_description_box'] );
            
        // } else {
            remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
            remove_action( 'woocommerce_single_variation', 'woocommerce_single_variation', 10 );
            if ( !empty(Catalog()->setting->get_setting( 'is_hide_cart_checkout' )) ) {          
                remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
                remove_action( 'woocommerce_single_variation', 'woocommerce_single_variation_add_to_cart_button', 20 );
            }  
        }
    }

    /**
     * Register description box for display in shop page
     * @return void
     */
    public function register_description_box() {
        
        // Get shop page button settings
        $position_settings = Catalog()->setting->get_setting( 'shop_page_possition_setting' );
        $position_settings = is_array( $position_settings ) ? $position_settings : [];

        // Priority of colide position
        $possiton_priority = 1;

        // Possiotion after a particular section
        $possition_after   = 'sku_category';

        // If possition settings exists
        if ( $position_settings ) {
            // Get the colide possition priority
            $possiton_priority = array_search( 'additional_input', array_keys( $position_settings ) ) + 1;

            // Get the possition after
            $possition_after   = $position_settings[ 'additional_input' ]; 
        }
        
        $position_settings = is_array( $position_settings ) ? $position_settings : [];

        // Priority of colide position
        $possiton_priority = 1;

        // Possiotion after a particular section
        $possition_after   = 'sku_category';

        // If possition settings exists
        if ( $position_settings ) {
            // Get the colide possition priority
            $possiton_priority = array_search( 'additional_input', array_keys( $position_settings ) ) + 1;

            // Get the possition after
            $possition_after   = $position_settings[ 'additional_input' ]; 
        }

        // Display button group in a hooked based on possition setting
        switch ( $possition_after ) {
            case 'sku_category':
                add_action( 'woocommerce_product_meta_end', [ self::class, 'display_description_box' ], 99 + $possiton_priority );
                break;
            case 'add_to_cart':
            case 'product_description':
                add_action( 'woocommerce_product_meta_start', [ self::class, 'display_description_box' ], 99 + $possiton_priority );
                break;
            case 'price_section':
                add_action( 'woocommerce_single_product_summary', [ self::class, 'display_description_box' ], 10 + $possiton_priority );
                break;
            default:
                add_action( 'woocommerce_single_product_summary', [ self::class, 'display_description_box' ], 6 + $possiton_priority );
                break;
        }
    }

     /**
     * Display descriopton box
     * @return void
     */
    public static function display_description_box() {
        do_action( 'display_shop_page_description_box' );
    }
}