<?php

namespace CatalogEnquiry\Core;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * MVX_Woocommerce_Catalog_Enquiry_Cart
 */
// class QuoteCart {
//     public $session      = null;
//     public $errors       = [];
//     public $key          = null;

//     /**
//      * Cart class constructor function
//      * @param mixed $key Unique key for cart
//      */
// 	public function __construct( $key = '' ) {

//         // Set the cart key
//         $this->key = $key;

// 		add_action( 'init', [ $this, 'session_start' ] );

//         // add_action( 'wp_loaded', array( $this, 'init_callback' ));
//         // add_action( 'wp', array( $this, 'maybe_set_cart_cookies' ), 99 ); 
//         // add_action( 'shutdown', array( $this, 'maybe_set_cart_cookies' ), 0 );
//         // add_action( 'quote_clean_cron', array( $this, 'clean_session'));
//         // add_action( 'wp_loaded', array( $this, 'add_to_quote_action' ), 30);
// 	}

// 	/**
// 	 * Starts the php session data for the cart.
// 	 */
// 	function session_start() {
// 		if( ! isset( $_COOKIE[ 'woocommerce_items_in_cart' ] ) ) {
// 			do_action( 'woocommerce_set_cart_cookies', true );
// 		}

//         // Init session
// 		$this->session = new Session();
// 		$this->set_session();
// 	}

//     /**
//      * Sets the php session data for the enquiry cart.
//      * @param mixed $cart_session session data
//      * @param mixed $can_be_empty if it is true it set a empty session
//      * @return void
//      */
// 	public function set_session( $cart_session = [], $can_be_empty = false ) {

// 		if ( empty( $cart_session ) && ! $can_be_empty ) {
//             $cart_session = $this->get_session();
//         }

//         // Set quote_cart  session data
//         $this->session->set( $this->key, $cart_session );
// 	}

//     /**
//      * Get the session data
//      * @return array|string
//      */
//     function get_session() {
//         return $this->session->get( $this->key, [] );
//     }

//     /**
//      * Unset the session
//      * @return void
//      */
//     public function unset_session() {
//         $this->session->__unset( $this->key );
//     }

//     /**
//      * Clean session
//      * @return void
//      */
//     public function clean_session() {
//         global $wpdb;
//         $query = $wpdb->query( "DELETE FROM ". $wpdb->prefix ."options  WHERE option_name LIKE '_woocommerce_catalog_session_%'");
//     }

// 	function init_callback() {
//         $this->get_session();
//         $this->session->set_customer_session_cookie(true);
//         $this->quote_validation_schedule();
//     }

//     public function quote_validation_schedule() {

//         if( ! wp_next_scheduled( 'quote_validation_schedule' ) ){
//             $ve = get_option( 'gmt_offset' ) > 0 ? '+' : '-';
//             wp_schedule_event( strtotime( '00:00 tomorrow ' . $ve . get_option( 'gmt_offset' ) . ' HOURS'), 'daily', 'quote_validation_schedule' );
//         }

//         if ( !wp_next_scheduled( 'quote_clean_cron' ) ) {
//             wp_schedule_event( time(), 'daily', 'quote_clean_cron' );
//         }
//     }

// 	function maybe_set_cart_cookies() {
//         $set = true;

//         if ( !headers_sent() ) {
//             if ( sizeof( $this->quote_cart_content ) > 0 ) {
//                 $this->set_cart_cookies( true );
//                 $set = true;
//             }
//             elseif ( isset( $_COOKIE['quote_items_in_cart'] ) ) {
//                 $this->set_cart_cookies( false );
//                 $set = false;
//             }
//         }

//         do_action( 'quote_set_cart_cookies', $set );
//     }

//     private function set_cart_cookies( $set = true ) {
//         if ( $set ) {
//             wc_setcookie( 'quote_items_in_cart', 1 );
//             wc_setcookie( 'quote_hash', md5( json_encode( $this->quote_cart_content ) ) );
//         }
//         elseif ( isset( $_COOKIE['quote_items_in_cart'] ) ) {
//             wc_setcookie( 'quote_items_in_cart', 0, time() - HOUR_IN_SECONDS );
//             wc_setcookie( 'quote_hash', '', time() - HOUR_IN_SECONDS );
//         }
//     }

//     public function add_to_quote_action() {

//         $product_id      = apply_filters( 'woocommerce_add_to_quote_product_id', absint( $_REQUEST['add-to-quote'] ) );
//         $variation_id    = empty( $_REQUEST['variation_id'] ) ? '' : absint( wp_unslash( $_REQUEST['variation_id'] ) );
//         $adding_to_quote = wc_get_product( $product_id );

//         if ( ! $adding_to_quote ) {
//             return;
//         }

//         $quantity = empty( intval( wp_unslash( $_REQUEST['quantity'] ) ) ) ? 1 : wc_stock_amount( intval( wp_unslash( $_REQUEST['quantity'] ) ) );
//         $raq_data = array();

//         if ( $adding_to_quote->is_type( 'variable' ) && $variation_id ) {
//             $variation  = wc_get_product( $variation_id );
//             $attributes = $variation->get_attributes();

//             if ( ! empty( $attributes ) ) {
//                 foreach ( $attributes as $name => $value ) {
//                     $raq_data[ 'attribute_' . $name ] = $value;
//                 }
//             }
//         }

//         $raq_data = array_merge(
//             array(
//                 'product_id'   => $product_id,
//                 'variation_id' => $variation_id,
//                 'quantity'     => $quantity,
//             ),
//             $raq_data
//         );

//         $return   = $this->add_cart_item( $raq_data );

//         if ( 'true' === $return ) {
//             $message = 'product_added';
//             wc_add_notice( $message, 'success' );
           
//         } elseif ( 'exists' === $return ) {
//             $message = 'already_in_quote';
//             wc_add_notice( $message, 'notice' );
//         }
//     }

//     public function add_cart_item( $cart_data ) {

//         $cart_data['quantity'] = ( isset( $cart_data['quantity'] ) ) ? (int) $cart_data['quantity'] : 1;
//         $return = '';
        
//         do_action( 'woocommerce_catalog_add_to_enquiry_cart', $cart_data );
        
//         if ( !$this->exists_in_cart( $cart_data['product_id'] ) ) {
//             $enquiry = array(
//                 'product_id'    => $cart_data['product_id'],
//                 'variation'     => $cart_data['variation'],
//                 'quantity'      => $cart_data['quantity']
//             );

//             $this->quote_cart_content[md5( $cart_data['product_id'] )] = $enquiry;
//         }
//         else {
//             $return = 'exists';
//         }

//         if ( $return != 'exists' ) {
//             $this->set_session( $this->quote_cart_content );
//             $return = 'true';
//             $this->set_cart_cookies( sizeof( $this->quote_cart_content ) > 0 );
//         }
//         return $return;
//     }

//     public function exists_in_cart( $product_id, $variation_id = false ) {
//         if ( $variation_id ) {
//             $key_to_find = md5( $product_id . $variation_id );
//         } else {
//             $key_to_find = md5( $product_id );
//         }
//         if ( array_key_exists( $key_to_find, $this->quote_cart_content ) ) {
//             $this->errors[] = __( 'Product already in Cart.', 'woocommerce-catalog-enquiry-pro' );
//             return true;
//         }
//         return false;
//     }

//     public function get_cart_data() {
//         return $this->quote_cart_content;
//     }

//     public function get_request_quote_page_url() {
//         $catalog_quote_page_id = get_option( 'request_quote_page' );
//         $base_url     = get_the_permalink( $catalog_quote_page_id );

//         return apply_filters( 'catalog_request_quote_page_url', $base_url );
//     }

//     public function get_request_quote_thank_you_page_url() {
//         $catalog_quote_page_id = get_option( 'request_quote_thank_you_page' );
//         $base_url     = get_the_permalink( $catalog_quote_page_id );

//         return apply_filters( 'catalog_request_quote_thank_you_page_url', $base_url );
//     }

//     public function is_empty_cart() {
//         return empty( $this->quote_cart_content );
//     }

//     public function remove_cart( $key ) {

//         if ( isset( $this->quote_cart_content[$key] ) ) {
//             unset( $this->quote_cart_content[$key] );
//             $this->set_session( $this->quote_cart_content, true );
//             return true;
//         }
//         else {
//             return false;
//         }
//     }

//     public function clear_cart() {
//         $this->quote_cart_content = array();
//         $this->set_session( $this->quote_cart_content, true );
//     }

//     public function update_cart( $key, $field = false, $value = '' ) {
//         if ( $field && isset( $this->quote_cart_content[$key][$field] ) ) {
//             $this->quote_cart_content[$key][$field] = $value;
//             $this->set_session( $this->quote_cart_content );
//         }
//         elseif ( isset( $this->quote_cart_content[$key] ) ) {
//             $this->quote_cart_content[$key] = $value;
//             $this->set_session( $this->quote_cart_content );
//         }
//         else {
//             return false;
//         }
//         $this->set_session( $this->quote_cart_content );
//         return true;
//     }

// }

class QuoteCart {
	
    public $session;
    public $quote_cart_content = array();
    public $errors = array();
	/**
	 * Constructor
	 *
	 * @access public
	 * @return void
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'quote_session_start' ));
        add_action( 'wp_loaded', array( $this, 'init_callback' ));
        add_action( 'wp', array( $this, 'maybe_set_cart_cookies' ), 99 ); 
        add_action( 'shutdown', array( $this, 'maybe_set_cart_cookies' ), 0 );
        add_action( 'quote_clean_cron', array( $this, 'clean_session'));
        add_action( 'wp_loaded', array( $this, 'add_to_quote_action' ), 30);
	}

	/**
	 * Starts the php session data for the cart.
	 */
	function quote_session_start(){
		if( ! isset( $_COOKIE['woocommerce_items_in_cart'] ) ) {
			do_action( 'woocommerce_set_cart_cookies', true );
		}
		$this->session = new Session();
		$this->set_session();
	}

	function init_callback() {
        $this->get_quote_cart_session();
        $this->session->set_customer_session_cookie(true);
        $this->quote_validation_schedule();
    }

    function get_quote_cart_session() {
        $this->quote_cart_content = $this->session->get( 'quote_cart', array() );
        return $this->quote_cart_content;
    }

    public function quote_validation_schedule(){

        if( ! wp_next_scheduled( 'quote_validation_schedule' ) ){
            $ve = get_option( 'gmt_offset' ) > 0 ? '+' : '-';
            wp_schedule_event( strtotime( '00:00 tomorrow ' . $ve . get_option( 'gmt_offset' ) . ' HOURS'), 'daily', 'quote_validation_schedule' );
        }

        if ( !wp_next_scheduled( 'quote_clean_cron' ) ) {
            wp_schedule_event( time(), 'daily', 'quote_clean_cron' );
        }
    }

    public function clean_session(){
        global $wpdb;
        $query = $wpdb->query("DELETE FROM ". $wpdb->prefix ."options  WHERE option_name LIKE '_woocommerce_catalog_session_%'");
    }


	/**
	 * Sets the php session data for the enquiry cart.
	 */
	public function set_session($cart_session = array(), $can_be_empty = false) {

		if ( empty( $cart_session ) && !$can_be_empty) {
            $cart_session = $this->get_quote_cart_session();
        }
        // Set quote_cart  session data
        $this->session->set( 'quote_cart', $cart_session );
	}

	public function unset_session() {
        $this->session->__unset( 'quote_cart' );
    }

	function maybe_set_cart_cookies() {
        $set = true;

        if ( !headers_sent() ) {
            if ( sizeof( $this->quote_cart_content ) > 0 ) {
                $this->set_cart_cookies( true );
                $set = true;
            }
            elseif ( isset( $_COOKIE['quote_items_in_cart'] ) ) {
                $this->set_cart_cookies( false );
                $set = false;
            }
        }

        do_action( 'quote_set_cart_cookies', $set );
    }

    private function set_cart_cookies( $set = true ) {
        if ( $set ) {
            wc_setcookie( 'quote_items_in_cart', 1 );
            wc_setcookie( 'quote_hash', md5( json_encode( $this->quote_cart_content ) ) );
        }
        elseif ( isset( $_COOKIE['quote_items_in_cart'] ) ) {
            wc_setcookie( 'quote_items_in_cart', 0, time() - HOUR_IN_SECONDS );
            wc_setcookie( 'quote_hash', '', time() - HOUR_IN_SECONDS );
        }
    }

    public function add_to_quote_action() {
        if ( ! isset( $_REQUEST['add-to-quote'] ) ) return;

        $product_id      = apply_filters( 'woocommerce_add_to_quote_product_id', absint( $_REQUEST['add-to-quote'] ) );
        $variation_id    = empty( $_REQUEST['variation_id'] ) ? '' : absint( wp_unslash( $_REQUEST['variation_id'] ) );
        $adding_to_quote = wc_get_product( $product_id );

        if ( ! $adding_to_quote ) {
            return;
        }

        $quantity = empty( intval( wp_unslash( $_REQUEST['quantity'] ) ) ) ? 1 : wc_stock_amount( intval( wp_unslash( $_REQUEST['quantity'] ) ) );
        $raq_data = array();

        if ( $adding_to_quote->is_type( 'variable' ) && $variation_id ) {
            $variation  = wc_get_product( $variation_id );
            $attributes = $variation->get_attributes();

            if ( ! empty( $attributes ) ) {
                foreach ( $attributes as $name => $value ) {
                    $raq_data[ 'attribute_' . $name ] = $value;
                }
            }
        }

        $raq_data = array_merge(
            array(
                'product_id'   => $product_id,
                'variation_id' => $variation_id,
                'quantity'     => $quantity,
            ),
            $raq_data
        );
        $return   = $this->add_cart_item( $raq_data );

        if ( 'true' === $return ) {
            $message = 'product_added';
            wc_add_notice( $message, 'success' );
           
        } elseif ( 'exists' === $return ) {
            $message = 'already_in_quote';
            wc_add_notice( $message, 'notice' );
        }
    }

    public function add_cart_item( $cart_data ) {

        $cart_data['quantity'] = ( isset( $cart_data['quantity'] ) ) ? (int) $cart_data['quantity'] : 1;
        $return = '';
        
        do_action( 'woocommerce_catalog_add_to_enquiry_cart', $cart_data );
        
        if ( !$this->exists_in_cart( $cart_data['product_id'] ) ) {
            $enquiry = array(
                'product_id'    => $cart_data['product_id'],
                'variation'     => $cart_data['variation'],
                'quantity'      => $cart_data['quantity']
            );

            $this->quote_cart_content[md5( $cart_data['product_id'] )] = $enquiry;
        }
        else {
            $return = 'exists';
        }

        if ( $return != 'exists' ) {
            $this->set_session( $this->quote_cart_content );
            $return = 'true';
            $this->set_cart_cookies( sizeof( $this->quote_cart_content ) > 0 );
        }
        return $return;
    }

    public function exists_in_cart( $product_id, $variation_id = false ) {
        if ( $variation_id ) {
            $key_to_find = md5( $product_id . $variation_id );
        } else {
            $key_to_find = md5( $product_id );
        }
        if ( array_key_exists( $key_to_find, $this->quote_cart_content ) ) {
            $this->errors[] = __( 'Product already in Cart.', 'woocommerce-catalog-enquiry' );
            return true;
        }
        return false;
    }

    public function get_cart_data() {
        return $this->quote_cart_content;
    }

    public function get_request_quote_page_url() {
        $catalog_quote_page_id = get_option( 'request_quote_page' );
        $base_url     = get_the_permalink( $catalog_quote_page_id );

        return apply_filters( 'catalog_request_quote_page_url', $base_url );
    }

    public function get_request_quote_thank_you_page_url() {
        $catalog_quote_page_id = get_option( 'request_quote_thank_you_page' );
        $base_url     = get_the_permalink( $catalog_quote_page_id );

        return apply_filters( 'catalog_request_quote_thank_you_page_url', $base_url );
    }

    public function is_empty_cart() {
        return empty( $this->quote_cart_content );
    }

    public function remove_cart( $key ) {

        if ( isset( $this->quote_cart_content[$key] ) ) {
            unset( $this->quote_cart_content[$key] );
            $this->set_session( $this->quote_cart_content, true );
            return true;
        }
        else {
            return false;
        }
    }

    public function clear_cart() {
        $this->quote_cart_content = array();
        $this->set_session( $this->quote_cart_content, true );
    }

    public function update_cart( $key, $field = false, $value = '' ) {
        if ( $field && isset( $this->quote_cart_content[$key][$field] ) ) {
            $this->quote_cart_content[$key][$field] = $value;
            $this->set_session( $this->quote_cart_content );
        }
        elseif ( isset( $this->quote_cart_content[$key] ) ) {
            $this->quote_cart_content[$key] = $value;
            $this->set_session( $this->quote_cart_content );
        }
        else {
            return false;
        }
        $this->set_session( $this->quote_cart_content );
        return true;
    }

}