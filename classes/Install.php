<?php
namespace CatalogEnquiry;

class Install {
    const VERSION_KEY = 'catalog_enquiry_plugin_version';

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
        
        $this->create_page_for_quote();
        $this->create_page_for_quote_thank_you();
        $this->create_page_for_wholesale_product_list();

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

        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS `" . $wpdb->prefix . "catalog_enquiry_table` (
                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                `product_info` text NOT NULL,
                `user_id` bigint(20) NOT NULL DEFAULT 0,
                `user_name` varchar(50) NOT NULL,
                `user_email` varchar(50) NOT NULL,
                `user_additional_fields` text NOT NULL,
                `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) $collate;"
        );

        $wpdb->query("ALTER TABLE `" . $wpdb->prefix . "catalog_enquiry_table` 
        ADD COLUMN pin_msg_id bigint(20);");

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

        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS `" . $wpdb->prefix . "catalog_rule` (
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

        $wpdb->query("ALTER TABLE `" . $wpdb->prefix . "catelog_cust_vendor_answers`
            ADD COLUMN attachment bigint(20);");
        $wpdb->query("ALTER TABLE `" . $wpdb->prefix . "catelog_cust_vendor_answers`
            ADD COLUMN reaction varchar(20);");
        $wpdb->query("ALTER TABLE `" . $wpdb->prefix . "catelog_cust_vendor_answers`
            ADD COLUMN star bigint(20);");
    }

    /**
     * Set default modules
     * @return void
     */
    public static function set_default_modules() {
        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            
            // Enable enquiry module by default
            $active_module_list = [ 'enquiry' ];
            
            $previous_settings = get_option( 'woocommerce_catalog_enquiry_general_settings', [] );

            // Enable catalog setting based on previous setting
            if ( isset( $previous_settings[ 'is_enable' ] ) && $previous_settings[ 'is_enable' ] === 'Enable' ) {
                $active_module_list[] = [ 'catalog' ];
            }

            update_option( Modules::ACTIVE_MODULES_DB_KEY, $active_module_list );
        }
    }

    /**
     * Migrate database 
     * @return void
     */
    public function migrate_database_table() {
        if ( version_compare( self::$previous_version, '5.0.8', '<=' ) ) {
            
        }
    }

    /**
     * Set default settings
     * @return void
     */
    public function set_default_settings() {
        // $catalog_settings = [ 
        //     'enquiry_user_permission' => "all_users", 
        //     'quote_user_permission' => "all_users", 
        //     'is_hide_cart_checkout' => ['is_hide_cart_checkout']
        // ];

        $tool_settings = [
            'set_enquiry_cart_page' => intval(get_option('catalog_enquiry_cart_page')),
            'set_request_quote_page' => intval(get_option('request_quote_page'))
        ];

        $form_settings = [
            'formsettings' => [
                'formfieldlist' => [ 
                    [
                      'id' => 1,
                      'type' => 'title',
                      'label' => 'Enquiry Form',
                    ],
                    [
                      'id' => 2,
                      'type' => 'text',
                      'label' => 'Enter your name',
                      'required' => true,
                      'placeholder' => 'I am default place holder',
                      'name' => 'name',
                      'not_editable'  => true
                    ],
                    [
                      'id' => 3,
                      'type' => 'email',
                      'label' => 'Enter your email',
                      'required' => true,
                      'placeholder' => 'I am default place holder',
                      'name' => 'email',
                      'not_editable'  => true
                    ],
                ],
                'butttonsetting' => [],
            ],
            'freefromsetting' => [
                  [
                    'key' => 'name',
                    'label' => 'Enter your name',
                    'active' => true,
                  ],
                  [
                    'key' => 'email',
                    'label' => 'Enter your email',
                    'active' => true,
                  ],
            ],            
        ];

        update_option('catalog_enquiry_form_customization_settings', $form_settings);
        // update_option( 'catalog_all_settings_settings', $catalog_settings );
        update_option('catalog_tools_settings', $tool_settings);

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
            'post_title' => __('Request Quote', 'woocommerce-catalog-enquiry-pro'),
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
            'post_title' => __('Quotation Confirmation', 'woocommerce-catalog-enquiry-pro'),
            'post_content' => '[request_quote_thank_you]',
            'comment_status' => 'closed'
        ];
        $page_id = wp_insert_post($page_data);
        update_option('request_quote_thank_you_page', $page_id);
    }

    /**
     * Create page for wholesale pruduct list
     * @return void
     */
    public function create_page_for_wholesale_product_list() {
        // quote page
        $option_value = get_option('wholesale_product_list_page');
        if ($option_value > 0 && get_post($option_value)) {
            return;
        }

        $page_found = get_posts([
            'name' => 'wholesale-product-list',
            'post_status' => 'publish',
            'post_type' => 'page',
            'fields' => 'ids',
            'numberposts' => 1
        ]);
        if ($page_found) {
            if (!$option_value) {
                update_option('wholesale_product_list_page', $page_found[0]);
            }
            return;
        }
        $page_data = [
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'post_name' => 'wholesale-product-list',
            'post_title' => __('Wholesale Product List', 'woocommerce-catalog-enquiry-pro'),
            'post_content' => '[wholesale_product_list]',
            'comment_status' => 'closed'
        ];
        $page_id = wp_insert_post($page_data);
        update_option('wholesale_product_list_page', $page_id);
    }
}