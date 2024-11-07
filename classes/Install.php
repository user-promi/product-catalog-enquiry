<?php
namespace CatalogEnquiry;

class Install {
    const VERSION_KEY = 'catalog_enquiry_plugin_version';

    const FREE_FORM_MAP = [
        'name'           => 'name-label',
        'email'          => 'email-label',
        'phone'          => 'is-phone',
        'address'        => 'is-address',
        'subject'        => 'is-subject',
        'comment'        => 'is-comment',
        'fileupload'     => 'is-fileupload',
        'filesize-limit' => 'filesize-limit',
        'captcha'        => 'is-captcha',
    ];

    const PRO_FORM_TYPE_MAP = [
        'p_title' => 'title',
        'textbox' => 'text',
    ];

    public static $previous_version = '';

    public static $current_version  = '';

    /**
     * Install class constructor functions
     */
    public function __construct() {

        // Get the previous version and current version
        self::$previous_version = get_option( self::VERSION_KEY, '' );
        self::$current_version  = Catalog()->version;

        $this->create_database_table();

        $this->set_default_modules();

        $this->migrate_database_table();
        
        $this->set_default_settings();

        $this->migrate_vendor_settings();
        
        $this->create_page_for_quote();
        $this->create_page_for_quote_thank_you();

        // Update the version in database
        update_option( self::VERSION_KEY, self::$current_version );
    }

    /**
     * Create database table for plugin
     * @return void
     */
    private function create_database_table() {
        global $wpdb;

        $collate = '';

        if ($wpdb->has_cap('collation')) {
            $collate = $wpdb->get_charset_collate();
        }

        // Create message table
        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS `" . $wpdb->prefix . "catelog_cust_vendor_answers` (
                `chat_message_id` bigint(20) NOT NULL AUTO_INCREMENT,
                `to_user_id` bigint(20) NOT NULL,
                `from_user_id` bigint(20) NOT NULL,
                `chat_message` text NOT NULL,
                `product_id` text NOT NULL,
                `enquiry_id` bigint(20) NOT NULL,
                `status` varchar(20) NOT NULL,
                `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`chat_message_id`)
            ) $collate;"
        );

        // Create enquiry table
        $wpdb->query(
           "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}" . Utill::TABLES[ 'enquiry' ] . "` (
                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                `product_info` text NOT NULL,
                `user_id` bigint(20) NOT NULL DEFAULT 0,
                `user_name` varchar(50) NOT NULL,
                `user_email` varchar(50) NOT NULL,
                `user_additional_fields` text NOT NULL,
                `pin_msg_id` bigint(20) DEFAULT NULL,
                `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) $collate;"
        );

        // Create rules table
        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}" . Utill::TABLES[ 'rule' ] . "` (
                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                `name` text,
                `user_id` bigint(20),
                `role_id` varchar(100),
                `product_id` bigint(20),
                `category_id` bigint(20),
                `quentity` bigint(20) NOT NULL,
                `type` varchar(20) NOT NULL,
                `amount` bigint(20) NOT NULL,
                `priority` bigint(20) NOT NULL,
                `active` boolean NOT NULL DEFAULT true,
                PRIMARY KEY ( `id` )
            ) $collate;"
        );

        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            // Rebame the table
            $wpdb->query(
                "ALTER TABLE `{$wpdb->prefix}catelog_cust_vendor_answers` RENAME TO `{$wpdb->prefix}" . Utill::TABLES[ 'message' ] . "`"
            );

            // Add column to table
            $wpdb->query(
                "ALTER TABLE `{$wpdb->prefix}" . Utill::TABLES[ 'message' ] . "`
                ADD COLUMN attachment bigint(20);"
            );
            $wpdb->query(
                "ALTER TABLE `{$wpdb->prefix}" . Utill::TABLES[ 'message' ] . "`
                ADD COLUMN reaction varchar(20);"
            );
            $wpdb->query(
                "ALTER TABLE `{$wpdb->prefix}" . Utill::TABLES[ 'message' ] . "`
                ADD COLUMN star boolean;"
            );
        }
    }

    /**
     * Set default modules
     * @return void
     */
    public static function set_default_modules() {
        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            
            // Enable enquiry module by default
            $active_module_list = [ 'catalog' ];
            
            $previous_settings = get_option( 'mvx_catalog_general_tab_settings', [] );

            // Enable catalog setting based on previous setting
            if ( isset( $previous_settings[ 'is_enable_enquiry' ] ) && reset($previous_settings[ 'is_enable_enquiry' ]) === 'is_enable_enquiry' ) {
                $active_module_list[] = 'enquiry';
            }

            update_option( Modules::ACTIVE_MODULES_DB_KEY, $active_module_list );
        }
    }

    /**
     * Migrate database 
     * @return void
     */
    public function migrate_database_table() {
        global $wpdb;

        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            try {
                // Get enquiry post and post meta
                $enquirys_datas = $wpdb->get_results(
                    "SELECT p.ID as id,
                        p.post_author as user_id,
                        p.post_date as date,
                        MAX(CASE WHEN pm.meta_key = '_enquiry_username' THEN pm.meta_value END) as username,
                        MAX(CASE WHEN pm.meta_key = '_enquiry_useremail' THEN pm.meta_value END) as useremail,
                        MAX(CASE WHEN pm.meta_key = '_user_enquiry_fields' THEN pm.meta_value END) as additional_fields,
                        MAX(CASE WHEN pm.meta_key = '_enquiry_product' THEN pm.meta_value END) as product_ids,
                        MAX(CASE WHEN pm.meta_key = '_enquiry_product_quantity' THEN pm.meta_value END) as product_quantitys,
                    FROM {$wpdb->prefix}posts as p
                    JOIN {$wpdb->prefix}postmeta as pm ON p.ID = pm.post_id
                    WHERE p.post_type = 'wcce_enquiry'
                    GROUP BY p.ID",
                    ARRAY_A
                );

                foreach ( $enquirys_datas as $id => $enquiry ) {
                    $product_ids        = $enquiry[ 'product_ids' ];
                    $product_quantitys  = $enquiry[ 'product_quantitys' ];

                    $wpdb->insert(
                        "{$wpdb->prefix}" . Utill::TABLES['enquiry'],
                        [
                            'id'                     => $enquiry[ 'id' ],
                            'user_id'                => $enquiry[ 'user_id' ],
                            'user_name'              => $enquiry[ 'user_name' ],
                            'user_email'             => $enquiry[ 'useremail' ],
                            'user_additional_fields' => $enquiry[ 'additional_fields' ],
                            'date'                   => $enquiry[ 'date' ],
                            'product_info'           => [ $product_ids => $product_quantitys ],
                        ]
                    );

                    // Delete the posts
                    wp_delete_post( $enquiry[ 'id' ], false );
                }
            } catch ( \Exception $e ) {
                Utill::log( $e->getMessage() );
            }
        }
    }

    /**
     * Set default settings
     * @return void
     */
    public function set_default_settings() {
        // Migration by version controll
        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            
            $previous_general_settings = get_option( 'mvx_catalog_general_tab_settings', [] );
            $previous_button_settings = get_option( 'mvx_catalog_button_appearance_tab_settings', [] );
            // $previous_general_settings = $previous_general_settings[ 'woocommerce_catalog_enquiry_general_settings' ] ?? [];

            // Update product page builder
            $page_builder_setting = [
                'hide_product_price' => !empty($previous_general_settings[ 'is_remove_price_free' ]) ? true : false,
                'additional_input'   => $previous_general_settings[ 'replace_text_in_price' ] ?? '',
                'enquery_button'     => [
                    'button_text_color' => !empty($previous_button_settings['custom_text_color']) ? $previous_button_settings['custom_text_color'] : '',
                    'button_background_color_onhover' => !empty($previous_button_settings['custom_hover_background_color']) ? $previous_button_settings['custom_hover_background_color'] : '',
                    'button_text_color_onhover' => !empty($previous_button_settings['custom_hover_text_color']) ? $previous_button_settings['custom_hover_text_color'] : '',
                    'button_border_color' => !empty($previous_button_settings['custom_border_color']) ? $previous_button_settings['custom_border_color'] : '',
                    'button_border_size' => !empty($previous_button_settings['custom_border_size']) ? $previous_button_settings['custom_border_size'] : '',
                    'button_border_radious' => !empty($previous_button_settings['custom_border_radius']) ? $previous_button_settings['custom_border_radius'] : '',
                    'button_text' => !empty($previous_button_settings['enquiry_button_text']) ? $previous_button_settings['enquiry_button_text'] : '',
                    'button_font_size' => !empty($previous_button_settings['custom_font_size']) ? $previous_button_settings['custom_font_size'] : '',
                ]
            ];

            update_option( 'catalog_enquiry_catalog_customization_settings', $page_builder_setting );

            
            // Update shopping gurnal
            $all_settings = [
                'is_enable_out_of_stock'  => $previous_general_settings[ 'is_enable_out_of_stock' ] ?? [],
                'enquiry_user_permission' => $previous_general_settings[ 'for_user_type' ]['value'] == '1' ? ['enquiry_logged_out'] : [],
                'is_page_redirect'        => $previous_general_settings[ 'is_page_redirect' ] ?? [],
                'redirect_page_id'        => $previous_general_settings[ 'redirect_page_id' ] ? $previous_general_settings[ 'redirect_page_id' ]['value'] : '',
                'is_disable_popup'        => !empty($previous_general_settings[ 'is_disable_popup' ]) ? 'inline' : 'popup',
                'is_hide_cart_checkout'   => ['is_hide_cart_checkout'],
                'set_expiry_time'         => 'Never',
                'is_enable_multiple_product_enquiry'    => $previous_general_settings[ 'is_enable_multiple_product_enquiry' ] ?? [],
            ];

            update_option( 'catalog_all_settings_settings', $all_settings );

            
            $email_settings = [
                'additional_alert_email'  => $previous_general_settings[ 'other_emails' ] ?? get_option( 'admin_email' ),
            ];

            if (!empty($previous_general_settings['is_other_admin_mail'])) {
                $admin_email = get_option('admin_email');
                
                // Convert the string into an array, remove the admin email, and convert back to a string
                $emails_array = array_map('trim', explode(',', $email_settings['additional_alert_email']));
                $emails_array = array_diff($emails_array, [$admin_email]);
                $email_settings['additional_alert_email'] = implode(', ', $emails_array);
            }

            update_option( 'catalog_enquiry_email_temp_settings', $email_settings );

            // Update pages settings
            $page_settings = [
                'set_enquiry_cart_page'  => intval( get_option( 'catalog_enquiry_cart_page' ) ),
                'set_request_quote_page' => intval( get_option( 'request_quote_page' ) ),
                'set_wholesale_product_list_page' => intval( get_option( 'wholesale_product_list_page' ) )
            ];

            // update_option( 'catalog_tools_settings', $tool_settings );
            update_option( 'catalog_pages_settings', $page_settings );
            
            // Update form settings
            
            // Free form migration
            $previous_free_from_setting = get_option( 'mvx_catalog_enquiry_form_tab_settings', [] );

            $free_form = [
                [
                    'key'       => 'name',
                    'label'     => 'Enter your name',
                    'active'    => true,
                ],
                [
                    'key'       => 'email',
                    'label'     => 'Enter your email',
                    'active'    => true,
                ],
                [ "key" => "phone" ],
                [ "key" => "address" ],
                [ "key" => "subject" ],
                [ "key" => "comment" ],
                [ "key" => "fileupload" ],
                [ "key" => "filesize-limit" ],
                [ "key" => "captcha" ],
            ];
            

            $previous_free_from = $previous_free_from_setting[ 'enquiry_form_fileds' ];

            if ( is_array( $previous_free_from ) ) {
                
                $previous_free_from_keys = array_column( $previous_free_from, 0 );

                $free_form = array_map( function ( $form ) use ( $previous_free_from, $previous_free_from_keys ) {
                    
                    // Get label key and active status key
                    $label_key  = self::FREE_FORM_MAP[ $form[ 'key' ] ];
                    $active_key = "{$label_key}_checkbox";

                    $label_index  = array_search( $label_key, $previous_free_from_keys );
                    $active_index = array_search( $active_key, $previous_free_from_keys );

                    $label  = $form[ 'label' ] ?? '';
                    $active = $form[ 'active' ] ?? false;

                    $label  = $label_index ? $previous_free_from[ $label_index ][ 1 ] : $label;
                    $active = $active_index ? $previous_free_from[ $active_index ][ 1 ] : $active;

                    return [
                        'key'       => $form[ 'key' ],
                        'label'     => $label,
                        'active'    => $active,
                    ];

                }, $free_form );
            }

            // Pro form migration
            $previous_pro_from_setting = get_option( 'mvx_catalog_pro_enquiry_form_data', [] );

            if ( is_array( $previous_pro_from_setting ) && !empty($previous_pro_from_setting) ) {
                $pro_form = array_map( function ( $form ) {
                    return [
                        ...$form,
                        'name' => $form[ 'name' ],
                        'type' => self::PRO_FORM_TYPE_MAP[ $form[ 'type' ] ] ?? $form[ 'type' ],
                    ];
                }, $previous_pro_from_setting );
            } else {
                $pro_form = [ 
                    [
                        'id'      => 1,
                        'type'    => 'title',
                        'label'   => 'Enquiry Form',
                    ],
                    [
                        'id'           => 2,
                        'type'         => 'text',
                        'label'        => 'Enter your name',
                        'required'     => true,
                        'placeholder'  => 'I am default place holder',
                        'name'         => 'name',
                        'not_editable' => true
                    ],
                    [
                        'id'           => 3,
                        'type'         => 'email',
                        'label'        => 'Enter your email',
                        'required'     => true,
                        'placeholder'  => 'I am default place holder',
                        'name'         => 'email',
                        'not_editable' => true
                    ],
                ];
            }

            $form_settings = [
                'formsettings'    => [
                    'formfieldlist'  => $pro_form,
                    'butttonsetting' => [],
                ],
                'freefromsetting' => $free_form,          
            ];
    
            update_option( 'catalog_enquiry_form_customization_settings', $form_settings );

            //// Update exclusion settings
            $previous_exclusion_settings = get_option( 'mvx_catalog_exclusion_tab_settings', [] );

            // Prepare exclusion user list
            $exclusion_user_list = $previous_exclusion_settings[ 'woocommerce_user_list' ];
            $exclusion_user_list = is_array( $exclusion_user_list ) ? $exclusion_user_list : [];

            $exclusion_user_list = array_map(function ($user_list) {
                return [
                    'key'   => $user_list[ 'value' ],
                    'label' => $user_list[ 'label' ],
                    'value'	=> $user_list[ 'value' ],
                ];
            }, $exclusion_user_list );

            // Prepare user role list
            $exclusion_userroles_list = $previous_exclusion_settings[ 'woocommerce_userroles_list' ];
            $exclusion_userroles_list = is_array( $exclusion_userroles_list ) ? $exclusion_userroles_list : [];

            $exclusion_userroles_list = array_map(function ($user_list) {
                return [
                    'key'   => $user_list[ 'value' ],
                    'label' => $user_list[ 'label' ],
                    'value'	=> $user_list[ 'value' ],
                ];
            }, $exclusion_userroles_list );

            // Prepare product list
            $exclusion_product_list = $previous_exclusion_settings[ 'woocommerce_product_list' ];
            $exclusion_product_list = is_array( $exclusion_product_list ) ? $exclusion_product_list : [];

            $exclusion_product_list = array_map(function ($user_list) {
                return [
                    'key'   => $user_list[ 'value' ],
                    'label' => $user_list[ 'label' ],
                    'value'	=> $user_list[ 'value' ],
                ];
            }, $exclusion_product_list );

            // Prepare category list
            $exclusion_category_list = $previous_exclusion_settings[ 'woocommerce_category_list' ];
            $exclusion_category_list = is_array( $exclusion_category_list ) ? $exclusion_category_list : [];

            $exclusion_category_list = array_map( function ( $user_list ) {
                return [
                    'key'   => $user_list[ 'value' ],
                    'label' => $user_list[ 'label' ],
                    'value'	=> $user_list[ 'value' ],
                ];
            }, $exclusion_category_list );

            $exclusion_settings = [
                'catalog_exclusion_user_list'       => $exclusion_user_list,
                'enquiry_exclusion_user_list'       => $exclusion_user_list,

                'catalog_exclusion_userroles_list'  => $exclusion_userroles_list,
                'enquiry_exclusion_userroles_list'  => $exclusion_userroles_list,

                'enquiry_exclusion_product_list'    => $exclusion_product_list,
                'catalog_exclusion_product_list'    => $exclusion_product_list,

                'catalog_exclusion_category_list'   => $exclusion_category_list,
                'enquiry_exclusion_category_list'   => $exclusion_category_list,
            ];

            update_option( 'catalog_enquiry_quote_exclusion_settings', $exclusion_settings );
        }
    }

    public function migrate_vendor_settings() {
        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            $vendors = get_users( array( 'role' => 'dc_vendor' ) );

            foreach ( $vendors as $vendor ) {
                // Check if the vendor has the meta key '_mvx_vendor_catalog_settings'
                $catalog_settings = get_user_meta( $vendor->ID, '_mvx_vendor_catalog_settings', true );

                if ( ! empty( $catalog_settings['woocommerce_product_vendor_list'] ) && is_array( $catalog_settings['woocommerce_product_vendor_list'] ) ) {
                    $new_product_list = array();
                    $index = 0;
        
                    foreach ( $catalog_settings['woocommerce_product_vendor_list'] as $product_id ) {
                        // Get the product title (assuming these are product IDs)
                        $product = wc_get_product( $product_id );
        
                        if ( $product ) {
                            // Create the new format for each product
                            $new_product_list[] = array(
                                'value' => $product_id,
                                'label' => $product->get_name(),  // Fetch the product name
                                'index' => $index,
                            );
                            $index++;
                        }
                    }
                }

                if ( ! empty( $catalog_settings['woocommerce_category_vendor_list'] ) && is_array( $catalog_settings['woocommerce_category_vendor_list'] ) ) {
                    $new_category_list = array();
                    $index = 0;
        
                    foreach ( $catalog_settings['woocommerce_category_vendor_list'] as $category_id ) {
                        // Get the category name using the category ID
                        $category = get_term( $category_id, 'product_cat' ); // 'product_cat' is the WooCommerce category taxonomy
        
                        if ( $category ) {
                            // Create the new format for each category
                            $new_category_list[] = array(
                                'value' => $category_id,
                                'label' => $category->name,  // Fetch the category name
                                'index' => $index,
                            );
                            $index++;
                        }
                    }
                }

                // If the meta key does not exist or is empty, create it with default values
                if ( !empty( $catalog_settings ) ) {
                    $new_catalog_settings = array(
                        'selected_email_tpl' => $catalog_settings['selected_email_tpl'] ? $catalog_settings['selected_email_tpl'] : '',
                        'woocommerce_product_list' => $new_product_list,
                        'woocommerce_category_list' => $new_category_list,
                    );

                    // Update user meta with default catalog settings
                    update_user_meta( $vendor->ID, 'vendor_enquiry_settings', $new_catalog_settings );
                }
            }
        }
    }

    /**
     * Create page for quote
     * @return void
     */
    public function create_page_for_quote() {
        // quote page
        $option_value = get_option('request_quote_page');
        if ($option_value > 0 && get_post($option_value)) {
            return;
        }

        $page_found = get_posts([
            'name' => 'request-quote',
            'post_status' => 'publish',
            'post_type' => 'page',
            'fields' => 'ids',
            'numberposts' => 1
        ]);
        if ($page_found) {
            if (!$option_value) {
                update_option('request_quote_page', $page_found[0]);
            }
            return;
        }
        $page_data = [
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'post_name' => 'request-quote',
            'post_title' => __('Request Quote', 'woocommerce-catalog-enquiry'),
            'post_content' => '[request_quote]',
            'comment_status' => 'closed'
        ];
        $page_id = wp_insert_post($page_data);
        update_option('request_quote_page', $page_id);
    }

    /**
     * Create page for quote thakyou
     * @return void
     */
    function create_page_for_quote_thank_you() {
        // quote thank you page
        $option_value = get_option('request_quote_thank_you_page');
        if ($option_value > 0 && get_post($option_value)) {
            return;
        }

        $page_found = get_posts([
            'name' => 'request-quote-thank-you',
            'post_status' => 'publish',
            'post_type' => 'page',
            'fields' => 'ids',
            'numberposts' => 1
        ]);
        if ($page_found) {
            if (!$option_value) {
                update_option('request_quote_thank_you_page', $page_found[0]);
            }
            return;
        }
        $page_data = [
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'post_name' => 'request-quote-thank-you',
            'post_title' => __('Quotation Confirmation', 'woocommerce-catalog-enquiry'),
            'post_content' => '[request_quote_thank_you]',
            'comment_status' => 'closed'
        ];
        $page_id = wp_insert_post($page_data);
        update_option('request_quote_thank_you_page', $page_id);
    }

}