<?php 

namespace CatalogEnquiry\Quote;

class Util {

    /**
     * Check enquiry functionlity avialable for current user
     * @return bool
     */
    public static function is_available() {
        // Get the current user
        $current_user = wp_get_current_user();

        // Get exclusion setting
        $quote_exclusion_setting = Catalog()->setting->get_option( 'catalog_enquiry_quote_exclusion_settings' );

        // Get userroll exclusion settings
        $userroles_exclusion_settings = isset($quote_exclusion_setting[ 'quote_exclusion_userroles_list' ]) ? $quote_exclusion_setting[ 'quote_exclusion_userroles_list' ] : [];
        $userroles_exclusion_settings = is_array( $userroles_exclusion_settings ) ? $userroles_exclusion_settings : [];
        
        // Get excluded user roles
        $exclude_user_roles = array_map( function( $userrole ) {
            return $userrole[ 'key' ];
        }, $userroles_exclusion_settings );

        // Check current user's role is in exclude user roles
        if ( array_intersect( $exclude_user_roles, $current_user->roles ) ) {
            return false;
        }
        
        // Get user exclusion settings
        $userlist_exclusion_settings = isset($quote_exclusion_setting[ 'quote_exclusion_user_list' ]) ? $quote_exclusion_setting[ 'quote_exclusion_user_list' ] : [];
        $userlist_exclusion_settings = is_array( $userlist_exclusion_settings ) ? $userlist_exclusion_settings : [];

        // Get excluded user ids
        $exclude_user_ids = array_map( function( $userid ) {
            return $userid[ 'key' ];
        }, $userlist_exclusion_settings );

        // Check current user's id is in exclude user id
        if ( in_array( $current_user->ID, $exclude_user_ids ) ) {
            return false;
        }

        return true;
    }

    /**
     * Check enquiry functionlity avialable for product
     * @return bool
     */
    public static function is_available_for_product($product_id) {
        // Get exclusion setting
        $quote_exclusion_setting = Catalog()->setting->get_option( 'catalog_enquiry_quote_exclusion_settings' );

        // Get product exclusion settings
        $product_exclusion_settings = isset($quote_exclusion_setting['quote_exclusion_product_list']) ? $quote_exclusion_setting['quote_exclusion_product_list'] : [];
        $product_exclusion_settings = is_array( $product_exclusion_settings ) ? $product_exclusion_settings : [];
        // Get excluded products
        $exclude_products = array_map( function( $product ) {
            return $product[ 'key' ];
        }, $product_exclusion_settings );

        // Check current product id is in exclude products
        if ( in_array( $product_id, $exclude_products ) ) {
            return false;
        }

        // Get category exclusion settings
        $category_exclusion_settings = isset($quote_exclusion_setting['quote_exclusion_category_list']) ? $quote_exclusion_setting['quote_exclusion_category_list'] : [];
        $category_exclusion_settings = is_array( $category_exclusion_settings ) ? $category_exclusion_settings : [];
        
        // Get excluded category
        $exclude_categories = array_filter(array_map(function($category) use ($product_id) {
            $term_list = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'ids']);
            return $category['key'] == $term_list[0] ? $product_id : null;
        }, $category_exclusion_settings));
        
        // Check current product id is in exclude categories
        if ( in_array( $product_id, $exclude_categories ) ) {
            return false;
        }

        // Get tag exclusion settings
        $tag_exclusion_settings = isset($quote_exclusion_setting['quote_exclusion_tag_list']) ? $quote_exclusion_setting['quote_exclusion_tag_list'] : [];
        $tag_exclusion_settings = is_array( $tag_exclusion_settings ) ? $tag_exclusion_settings : [];
        
        // Get excluded tag
        $exclude_tags = array_filter(array_map( function( $tag ) use ($product_id) {
            $tag_term_list = wp_get_post_terms($product_id,'product_tag',['fields'=>'ids']);
            return $tag[ 'key' ] == $tag_term_list[0] ? $product_id : null;
        }, $tag_exclusion_settings ));

        // Check current product id is in exclude tags
        if ( in_array( $product_id, $exclude_tags ) ) {
            return false;
        }
        return true;
    }

    /**
     * get the user name from its email
     * @return int
     */
    public static function get_customer_id_by_email($email) {
        // Check if the customer exists
        $user = get_user_by('email', $email);
        if ($user) {
            return $user->ID;
        } else {
            return 0; // Customer doesn't exist
        }
    }

    /**
     * create new order
     * @return int
     */
    public static function create_new_order($customer_id, $customer_name, $customer_email, $customer_phone, $customer_message, $product_data) {
        $args = [
			'status'      => 'wc-quote-new',
			'customer_id' => $customer_id ,
        ];
        // Create the order
        $order = wc_create_order($args);

        // Add customer information
        $order->set_customer_id($customer_id);
        $order->set_billing_first_name($customer_name);
        $order->set_billing_email($customer_email);
        $order->set_billing_phone($customer_phone);

        $product_info = [];
        foreach ($product_data as $item) {
            $product_id = isset($item['product_id']) ? $item['product_id'] : null;
            $quantity = isset($item['quantity']) ? intval($item['quantity']) : 0;
    
            $product_info[] = [
                'product_id' => $product_id,
                'quantity' => $quantity
            ];
            if ($product_id && $quantity > 0) {
                $product = wc_get_product($product_id);
                if ($product) {
                    $order->add_product($product, $quantity);
                }
            }
        }
        // Add order notes
        $order->add_order_note($customer_message);
        // Calculate totals and save
        $order->calculate_totals();
		$order->add_meta_data( 'quote_req', 'yes');
		$order->add_meta_data( 'quote_customer_name', $customer_name);
		$order->add_meta_data( 'quote_customer_email', $customer_email);
        $order->add_meta_data( 'quote_customer_msg', $customer_message);
        $order->save();
        $customer_data = [
            'name' => $customer_name,
            'email' => $customer_email,
            'details'   => $customer_message
        ];
        $email = WC()->mailer()->emails[ 'requestQuoteSendEmail' ];
        $email->trigger( $product_info, $customer_data );

        Catalog()->quotecart->clear_cart();
        return $order->get_id();
    }
}