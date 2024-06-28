<?php 
namespace CatalogEnquiry;
class Install{
    public function __construct() {
        $this->create_database_table();
        $this->catalog_data_migrate();
    }

    private function create_database_table() {
        global $wpdb;

        $collate = '';

        if ($wpdb->has_cap('collation')) {
            $collate = $wpdb->get_charset_collate();
        }

        $wpdb->query(
            "CREATE TABLE IF NOT EXISTS `" . $wpdb->prefix . "catalog_enquiry_table` (
                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                `product_id` text NOT NULL,
                `product_quantity` text NOT NULL,
                `user_id` bigint(20) NOT NULL DEFAULT 0,
                `user_name` varchar(50) NOT NULL,
                `user_email` varchar(50) NOT NULL,
                `user_additional_fields` text NOT NULL,
                `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) $collate;"
        );

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

        $wpdb->query( "ALTER TABLE `" . $wpdb->prefix . "catelog_cust_vendor_answers` 
            ADD COLUMN reaction varchar(20),
            ADD COLUMN attachment bigint(20);");
    }

    function catalog_data_migrate() {
        $catalog_settings = [ 
            'for_user_type' => "all_users", 
            'button_text' => __( 'Customize', 'woocommerce-catalog-enquiry' ), 
            'alert_text_color' => '', 
            'button_background_color' => '', 
            'button_border_color' => '', 
            'button_text_color' => '', 
            'button_background_color_onhover' => '', 
            'button_text_color_onhover' => '', 
            'button_border_color_onhover' => '', 
            'button_font_size' => '', 
            'button_border_radious' => '', 
            'button_border_size' => ''
        ];

        update_option( 'catalog_catalog_settings', $catalog_settings );
    }
}