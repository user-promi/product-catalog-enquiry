<?php

namespace CatalogEnquiry\Wholesale;

use CatalogEnquiry\Utill;

class Util {
    /**
    * Check a user is wholesale user or not
    * @return bool
    */
    public static function is_wholesale_user() {
        $current_user = wp_get_current_user();
        return in_array( 'wholesale_user', $current_user->roles );
    }

    /**
     * Regsiter a user a wholesale user
     * @param mixed $user_id 
     * @return string
     */
    public static function register_wholesale_user( $user_id ) {

        $redirect = get_permalink( get_option('woocommerce_myaccount_page_id') );
        
        if ( Utill::is_pro_active() ) {
             // Get the setting for direct approve
            $approve_wholesaler = Catalog()->setting->get_setting( 'approve_wholesaler' );

            if ( $approve_wholesaler ) {
                self::approve_wholesale_user( $user_id );
                
                $enable_order_form = Catalog()->setting->get_setting( 'enable_order_form' );
                
                if ( $enable_order_form ) {
                    $redirect = get_permalink( get_option( 'wholesale_product_list_page' ) );
                    return $redirect;
                }
                
            } else {
                update_user_meta( $user_id, 'wholesale_customer_status', 'pending' );
            }
        } else {
            update_user_meta( $user_id, 'wholesale_customer_status', 'pending' );
        }
       
        return $redirect;
    }

    /**
     * Approve a user as wholesale user
     * @param mixed $user_id
     * @return void
     */
    public static function approve_wholesale_user( $user_id ) {
        $user = new \WP_User( $user_id );
        $user->set_role( 'wholesale_user' );
        update_user_meta( $user_id, 'wholesale_customer_status', 'approve' );
    }

    /**
     * Reject a user from wholesale user
     * @param mixed $user_id
     * @return void
     */
    public static function reject_wholesale_user( $user_id ) {
        $user = new \WP_User( $user_id );
        $user->remove_role( 'wholesale_user' );
        update_user_meta( $user_id, 'wholesale_customer_status', 'reject' );
    }
}