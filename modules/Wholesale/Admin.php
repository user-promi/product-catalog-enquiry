<?php

namespace CatalogEnquiry\Wholesale;

class Admin {
    /**
     * Admin class constructor functions
     */
    public function __construct() {
        // Create wholesale role
        add_action( 'init', [ $this, 'create_role' ] );

        // Add and save fields product tab
        add_filter( 'woocommerce_product_data_tabs', [ $this, 'add_custom_product_tab' ] );
        add_action( 'woocommerce_product_data_panels', [ $this, 'custom_product_data_fields' ] );
        add_action( 'woocommerce_process_product_meta', [ $this, 'save_custom_product_data_fields' ] );

        // Add and save fields in users tab
        // add_action( 'edit_user_profile', [ $this, 'add_extra_profile_field' ] );
        // add_action( 'edit_user_profile_update', [ $this, 'save_extra_profile_fields' ] );
    }

    /**
     * Create wholesale role
     * @return void
     */
    public function create_role() {
        // Check if the role already exists
        if ( null === get_role( 'wholesale_user' ) ) {
            add_role(
                'wholesale_user',
                __( 'Wholesale User' ),
                [
                    'read'          => true,
                    'edit_posts'    => true, 
                    'delete_posts'  => false,
                    'publish_posts' => true,
                    'upload_files'  => true, 
                ]
            );
        }
    }

    /**
     * Add custom field in product tab.
     * @param mixed $tabs
     * @return mixed
     */
    public function add_custom_product_tab( $tabs ) {
        // Add the new tab
        $tabs[ 'wholesale' ] = [
            'label'    => __( 'Wholesale', 'woocommerce-catalog-enquiry' ),
            'target'   => 'wholesale_product_data',
            'class'    => [ 'show_if_simple', 'show_if_variable' ],
            'priority' => 60,
        ];

        return $tabs;
    }

    /**
     * Content of custom field in product tab.
     * @return void
     */
    public function custom_product_data_fields() {
        global $post;

        // Retrieve existing value from the database
        $wholesale_product = get_post_meta( $post->ID, 'wholesale_product', true );

        ?>
        <div id='wholesale_product_data' class='panel woocommerce_options_panel'>
            <div class='options_group'>
                <?php  
                // Add a checkbox field
                woocommerce_wp_checkbox( array(
                    'id'    => 'wholesale_product',
                    'label' => __( 'Enable wholesale for this product', 'woocommerce-catalog-enquiry' ),
                    'value'   => $wholesale_product ?? 'no',
                ) );
                apply_filters('wholesale_product_options', $post);
                ?>
            </div>
        </div>
        <?php
    }

    /**
     * Save custom product data for wholesale product.
     * @param mixed $post_id
     * @return void
     */
    public function save_custom_product_data_fields( $post_id ) {
        $wholesale_product = isset( $_POST[ 'wholesale_product' ] ) ? 'yes' : 'no';
        update_post_meta( $post_id, 'wholesale_product', $wholesale_product );
    }

    /**
     * Display the custom field on the user profile page
     * @param mixed $user
     * @return void
     */
    public function add_extra_profile_field( $user ) {

        $status = get_user_meta( $user->ID, 'wholesale_customer_status', true );
        
        ?>
        <h3><?php _e('Wholesale User Request Confirmation', 'woocommerce-catalog-enquiry'); ?></h3>
        <table class="form-table">
            <tr>
                <th><label for="request_status"><?php _e('Request Status', 'woocommerce-catalog-enquiry'); ?></label></th>
                <td>
                    <label>
                        <input type="radio" name="request_status" value="approve" <?php checked($status, 'approve'); ?> /> <?php _e('Approve', 'woocommerce-catalog-enquiry'); ?>
                    </label><br />
                    <label>
                        <input type="radio" name="request_status" value="reject" <?php checked($status, 'reject'); ?> /> <?php _e('Reject', 'woocommerce-catalog-enquiry'); ?>
                    </label><br />
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Save the custom field on the user profile page
     * @param mixed $user_id
     * @return void
     */
    public function save_extra_profile_fields( $user_id ) {
        if ( ! current_user_can( 'edit_user', $user_id ) ) {
            return;
        }

        // Save the custom field value
        if ( isset( $_POST[ 'request_status' ] ) ) {
            update_user_meta( $user_id, 'wholesale_customer_status', sanitize_text_field( $_POST[ 'request_status' ] ) );
        }
    }
}
