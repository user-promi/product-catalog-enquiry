<?php 

namespace CatalogEnquiry\Enquiry;

use CatalogEnquiry\Utill;
use CatalogEnquiryPro\CatalogEnquiryPro;

class Rest {
    /**
     * Rest class constructor function
     */
    public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_rest_apis' ] );
    }

    /**
     * Register rest apis
     * @return void
     */
    function register_rest_apis() {
        register_rest_route( Catalog()->rest_namespace, '/save-form-data', [
            'methods'               => \WP_REST_Server::ALLMETHODS,
            'callback'              => [ $this, 'save_form_data' ],
            'permission_callback'   => [ Catalog()->restapi, 'catalog_permission' ],
        ]);

        register_rest_route( Catalog()->rest_namespace, '/render-enquiry-button', [
            'methods'               => \WP_REST_Server::ALLMETHODS,
            'callback'              => [ $this, 'render_enquiry_button_shortcode_rest' ],
            'permission_callback'   => [ Catalog()->restapi, 'catalog_permission' ],
        ]);
	}

    /**
     * Save enquiry form data
     * @param mixed $request
     * @return \WP_Error|\WP_REST_Response
     */
    public function save_form_data( $request ) {
        global $wpdb;

        $quantity   = $request->get_param( 'quantity' );
        $product_id = $request->get_param( 'productId' );

        $user       = wp_get_current_user();
        $user_name  = $user->display_name;
        $user_email = $user->user_email;
        
        $post_params = $request->get_body_params();
        $file_data   = $request->get_file_params();

        // Create attachment of files
        foreach ( $file_data as $file ) {
            $attachment_id = \CatalogEnquiry\Utill::create_attachment_from_files_array($file);
        }
        
        unset( $post_params[ 'quantity' ] );
        unset( $post_params[ 'productId' ] );

        // Get the product related info
        $product_info = [];

        if ( \CatalogEnquiry\Utill::is_pro_active() ) {
            $product_data = Catalog_PRO()->cart->get_cart_data();
            
            if ( $product_data ) {
                foreach ( $product_data as $data ) {
                    $product_info[ $data[ 'product_id' ] ] = $data[ 'quantity' ] ? $data[ 'quantity' ] : 1;
                }
            }
        }

        if ( empty( $product_info ) ) {
            $product_info[ $product_id ] = $quantity;
        }
        
        // Get extra fields
        $other_fields = [];
        foreach ( $post_params as $key => $value ) {
            switch ( $key ) {
                case 'name':
                    $customer_name = $user_name;
                    break;

                case 'email':
                    $customer_email = $user_email;
                    break;
                
                default:
                    $other_fields[] =  [
                        'name' => $key,
                        'value' => $value
                    ];
                    break;
            }
        }

        // Prepare data for insertion
        $data = [
            'product_info'           => serialize( $product_info ),
            'user_id'                => $user->ID,
            'user_name'              => $customer_name, 
            'user_email'             => $customer_email, 
            'user_additional_fields' => serialize( $other_fields ),
        ];

        $product_variations = ( get_transient( 'variation_list' ) ) ? get_transient( 'variation_list' ) : [];

        $result = $wpdb->insert("{$wpdb->prefix}" . Utill::TABLES[ 'enquiry' ], $data );

        if ( $result ) {
            $enquiry_id   = $wpdb->insert_id;
            $admin_email  = get_option( 'admin_email' );
            $User_details = get_user_by( 'email', $admin_email );
            $to_user_id   = $User_details->data->ID;
        
            $chat_message = '';
            foreach( $other_fields as $key => $field ) { 
                if ( $field[ 'name' ] != 'file' ) {
                    $chat_message.= '<strong>' . $field[ 'name' ] . ':</strong><br>' . $field[ 'value' ] . '<br>';
                }
            }
    
            $wpdb->query( $wpdb->prepare( "INSERT INTO {$wpdb->prefix}" . Utill::TABLES[ 'message' ] . " SET to_user_id=%d, from_user_id=%d, chat_message=%s, product_id=%s, enquiry_id=%d, status=%s", $to_user_id, $user->ID, $chat_message, serialize( $product_info ), $enquiry_id, 'unread' ) );

            $enquiry_data = apply_filters( 'woocommerce_catalog_enquiry_form_data', [
                'enquiry_id'            => $enquiry_id,
				'user_name'             => $customer_name,
				'user_email'            => $customer_email,
				'product_id'            => $product_info,
                'variations'            => $product_variations,
				'user_enquiry_fields'   => $other_fields,
			]);

            if (Utill::is_pro_active()) {
                $html = \CatalogEnquiryPro\Enquiry\Util::get_html($enquiry_data);
                if ($html) { 
                    $pdf_maker = new \CatalogEnquiryPro\PDFMaker($html);
                    $pdf = $pdf_maker->output();
            
                    // Save the PDF to a temporary location
                    $upload_dir = wp_upload_dir();
                    $file_path = $upload_dir['basedir'] . '/enquiry-' . $enquiry_id . '.pdf';
            
                    file_put_contents($file_path, $pdf);
        
                    $pdf_output = '';
                    $pdf_maker->get_pdf_headers($file_path, $pdf_output, $pdf);
                    // echo $pdf;
                } else {
                    wp_die(__("PDF document could not be generated", 'mvx-pro'));
                }
                $attach_pdf = Catalog()->setting->get_setting( 'enquiry_pdf_permission' );
                $attachments = ($attach_pdf === 'attach_pdf_to_email') ? [$file_path] : [];
            }
                        
            $additional_email = Catalog()->setting->get_setting( 'additional_alert_email' );
            $send_email = WC()->mailer()->emails[ 'EnquiryEmail' ];

			$send_email->trigger( $additional_email, $enquiry_data, $attachments ?? [] );
				
            $redirect_link = Catalog()->setting->get_setting( 'redirect_page_id' ) ? get_permalink(Catalog()->setting->get_setting( 'redirect_page_id' )) : '';
            
            $msg = __( "Enquiry sent successfully", 'woocommerce-catalog-enquiry' );
            
            if ( \CatalogEnquiry\Utill::is_pro_active() ) { 
                Catalog_PRO()->cart->unset_session(); 
            }

            return rest_ensure_response( [ 'redirect_link' => $redirect_link, 'msg' => $msg ] );
        }

        return rest_ensure_response( null );
    }

    /**
     * render enquiry button shortcode into block
     * @return \WP_Error|\WP_REST_Response
     */
    public function render_enquiry_button_shortcode_rest() {
        return rest_ensure_response(do_shortcode('[wce_enquiry_button]'));
    }

}