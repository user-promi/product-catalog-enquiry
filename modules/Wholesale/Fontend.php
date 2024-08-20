<?php

namespace CatalogEnquiry\Wholesale;

class Fontend {
    /**
     * Frontend class constructor function
     */
    public function __construct() {
        add_action( 'woocommerce_register_form', [ $this, 'add_fields_in_register' ] );
        add_action( 'woocommerce_created_customer',  [ $this, 'save_registration_fields' ] );

        // Register Wholesale menu for non wholesale users
        if ( ! Util::is_wholesale_user() ) {
            add_filter( 'woocommerce_account_menu_items', [ $this, 'register_menu' ] );
            add_action( 'woocommerce_account_wholesale_endpoint', [ $this, 'display_wholesale_page' ] );
            add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
        }

        // Register endpoints
        add_action( 'init', [ $this, 'register_endpoints' ] );

        // Add aditional discount info in single product summary
        add_action( 'woocommerce_single_product_summary', [ $this, 'add_aditional_product_info'], 10 );

        // Calculate discount amount for cart and checkout page
        add_filter('catalog_calculate_discount_in_cart_and_checkout', [ $this, 'calculate_discount_amount' ], 10);
    
        if ( Catalog()->setting->get_setting( 'disable_coupon_for_wholesale' ) ) {
            add_filter( 'woocommerce_coupon_is_valid', [ $this, 'disable_coupons_for_wholesale_users' ], 10, 2 );
        }

        if ( Catalog()->setting->get_setting( 'enable_order_form' ) ) {
            add_filter( 'woocommerce_login_redirect', [ $this, 'custom_registration_redirect' ] );
        }
    }

    /**
     * Add wholesale user option field in user registration page
     * @return void
     */
    public function add_fields_in_register() {
        ?>
        <p class="form-row form-row-wide">
            <label for="reg_wholesale_customer">
                <input type="checkbox" name="wholesale_customer" id="reg_wholesale_customer" value="yes" <?php checked(!empty($_POST['wholesale_customer'])); ?> />
                <?php _e('I want to be a wholesale customer', 'woocommerce-catalog-enquiry'); ?>
            </label>
        </p>
        <?php
    }

    /**
     * Register wholesale user
     * @param mixed $customer_id
     * @return void
     */
    public function save_registration_fields( $customer_id ) {

        if ( isset( $_POST[ 'wholesale_customer' ] ) && $_POST[ 'wholesale_customer' ] == 'yes' ) {
            update_user_meta( $customer_id, 'wholesale_customer', true );
            
            $redirect = Util::register_wholesale_user( $customer_id );
            
            wp_redirect( $redirect );
            exit;
        }
    }

    /**
     * Regsiter endpoints
     * @return void
     */
    public function register_endpoints() {
        add_rewrite_endpoint( 'wholesale', EP_ROOT | EP_PAGES );
        flush_rewrite_rules();
    }

    /**
     * Register menu in myaccount
     * @param mixed $menu_links
     * @return mixed
     */
    public function register_menu( $menu_links ){
        $menu_links[ 'wholesale' ] = 'Become a wholesaler';

        return $menu_links;
    }

    /**
     * Display Wholesale page
     * @return void
     */
    public function display_wholesale_page() {
        if ( is_user_logged_in() ) {
            ?>
                <div id="wholesale_register"></div>
            <?php
        } else {
            // Set myaccount page link
            $myaccount_page_url = get_permalink( get_option( 'woocommerce_myaccount_page_id' ) );
            ?>
                <a href="<?php echo $myaccount_page_url ?>"> <?php _e( 'Login for wholesale registration', 'woocommerce-catalog-enquiry' ); ?> </a>
            <?php
        }
        
    }

    /**
     * Enqueue javascript
     * @return void
     */
    public function enqueue_scripts() {
        // Enqueue script
        wp_enqueue_script(
            'wholesale_registration_form',
            Catalog()->plugin_url . 'build/blocks/wholesaleRegister/index.js',
            [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ],
            Catalog()->version,
            true
        );

        // Localize script
        wp_localize_script(
            'wholesale_registration_form', 'wholesale_form_data', [
            'apiurl'         => untrailingslashit(get_rest_url()),
            'nonce'          => wp_create_nonce( 'wp_rest' ),
            'from_settings'  => Catalog()->setting->get_setting( 'wholesale_from_settings' ),
            'user_id'        => get_current_user_id(),
        ]);
    }

    /**
     * Regsiter a user as wholesale capability
     * @param mixed $request
     * @return
     */
    public static function wholesale_register( $request ) {
        
        $user_id = $request[ 'userid' ];

        $post_params = $request->get_body_params();

        unset($post_params['userid']);

        $redirect = Util::register_wholesale_user( $user_id );

        // Update additional fields to user meta
        update_user_meta( $user_id, 'wholesale_additonal_fields', serialize( $post_params ) );
        
        return rest_ensure_response($redirect);
    }

    /**
     * Add aditional product infor for wholesale user.
     * @return void
     */
    public function add_aditional_product_info() {
        global $product;
        $discount_settings = Catalog()->setting->get_setting( 'wholesale_discount', [] );

        /**
         * Filter for add aditional product info
         * @var mixed
         */
        $settings = apply_filters( 'catalog_single_product_discount_settings', [
            'min_quantity'      => !empty($discount_settings[ 'minimum_quantity' ]) ? $discount_settings[ 'minimum_quantity' ] : '',
            'discount_type'     => !empty($discount_settings[ 'wholesale_discount_type' ]) ? $discount_settings[ 'wholesale_discount_type' ] : '',
            'discount_amount'   => !empty($discount_settings[ 'wholesale_amount' ]) ? floatval( $discount_settings[ 'wholesale_amount' ] ) : ''
        ]);

        // Extract the filtered settings
        $min_quantity    = $settings[ 'min_quantity' ];
        $discount_type   = $settings[ 'discount_type' ];
        $discount_amount = $settings[ 'discount_amount' ];
        
        // Get discout amount
        switch ( $discount_type ) {
            case 'fixed_amount':
                $amount = $discount_amount;
                break;
            case 'percentage_amount':
                $amount = $product->get_regular_price() * ( $discount_amount / 100 );
                break;
            
            default:
                $amount = 0;
                break;
        }

        // Calculate save amount
        $retail_price    = floatval( $product->get_regular_price() );
        $wholesale_price = $retail_price - floatval($amount); 
        $save_amount     = $amount;
        
        // Handle if the user is not wholesale user
        if ( ! Util::is_wholesale_user() ) {
            $show_text_for_non_user = Catalog()->setting->get_setting( 'show_wholesale_price' );
            if ( $show_text_for_non_user ) {
                ?>
                <div>
                    <?php echo sprintf( __("Become a wholesale member today and enjoy a %s discount on your purchases.",  'woocommerce-catalog-enquiry' ), wc_price($save_amount) );?>
                </div>
                <?php
            }
            return;
        }
        
        // Output the information
        ?>
            <div class="custom-product-info">
                <h2>Retail Price: <?php echo wc_price( $retail_price ); ?></h2>
                <h2>Wholesale Price: <?php echo wc_price( $wholesale_price ); ?></h2>
                <h2>Save: <?php echo wc_price( $save_amount ); ?></h2>
                <div>
                    <?php echo sprintf( __("To unlock your %s discount, add %s more items to your cart. Save more when you buy more!",  'woocommerce-catalog-enquiry' ), wc_price( $save_amount ), $min_quantity );?>
                </div>
            </div>
        <?php
    }

    /**
     * Calculate discount amount for cart and checkout page
     * @param mixed $discount
     * @return float
     */
    public function calculate_discount_amount( $discount ) {
        if ( ! Util::is_wholesale_user() ) {
            return $discount;
        }
        
        $discount_settings = Catalog()->setting->get_setting( 'wholesale_discount', [] ) ;
        $min_quantity = !empty($discount_settings[ 'minimum_quantity' ]) ? $discount_settings[ 'minimum_quantity' ] : '';
        
        // Get the total quantity of items in the cart
        $total_quantity = WC()->cart->get_cart_contents_count();
        $total_amount   = floatval( WC()->cart->get_cart_contents_total() );

        if ( $total_quantity >= $min_quantity ) {
            $discount_type   = !empty($discount_settings[ 'wholesale_discount_type' ]) ? $discount_settings[ 'wholesale_discount_type' ] : '';
            $discount_amount = !empty($discount_settings[ 'wholesale_amount' ]) ? floatval( $discount_settings[ 'wholesale_amount' ] ) : '';

            // Calculate the discount based on the type
            $discount = match ( $discount_type ) {
                'fixed_amount'      => -min($total_amount, $discount_amount),
                'percentage_amount' => -( $total_amount * ( $discount_amount / 100 ) ),
                default             => 0,
            };
        }

        return $discount;
    }

    /**
     * Custom registration redirect for wholesale user
     * @param mixed $redirect
     * @return bool|string
     */
    public function custom_registration_redirect( $redirect ) {
        if ( Util::is_wholesale_user() ) {
            $wholesale_product_list_page =  get_option( 'wholesale_product_list_page' );
            $redirect = get_permalink( $wholesale_product_list_page );
            return $redirect;
        } else {
            wp_redirect(get_permalink( get_option('woocommerce_myaccount_page_id') ));
            exit;
        }
    }

    /**
     * Disable cuppon for wholesale user.
     * @param mixed $valid
     * @param mixed $coupon
     * @return bool
     */
    public function disable_coupons_for_wholesale_users( $valid, $coupon ) {
        return ! Util::is_wholesale_user();
    }
}