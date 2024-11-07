<?php
namespace CatalogEnquiry\Emails;
/**
 * Email for request quote send 
 *
 * An email will be sent to customer
 *
 * @class 		woocommerce-catalog-enquiry-pro
 * @extends 	\WC_Email
 */

defined( 'ABSPATH' ) || exit;


if ( ! class_exists( 'RequestQuoteSendEmail' ) ) {

	class RequestQuoteSendEmail extends \WC_Email {
        // public $object;
        public $products;
        public $object;
        public $customer_data;
        public $admin;
		/**
		 * Constructor method, used to return object of the class to WC
		 *
		 * @since 1.0.0
		 */
		public function __construct() {
			$this->id          = 'RequestQuoteSend';
			$this->title       = __( 'Email to request a quote', 'woocommerce-catalog-enquiry-pro' );
			$this->description = __( 'This email is sent when a user clicks on "Request a quote" button', 'woocommerce-catalog-enquiry-pro' );

			$this->template_html  = 'emails/request-quote.php';
			$this->template_plain = 'emails/plain/request-quote.php';
			$this->template_base  = Catalog()->plugin_path . 'templates/';

             // Call parent constuctor
             parent::__construct();
        }
	/**
     * trigger function.
     *
     * @access public
     * @return void
     */
    function trigger( $products, $customer_data ) {
        $additional_email = Catalog()->setting->get_setting( 'additional_alert_email' );
        
        $this->recipient      = $additional_email;
        $this->products         = $products;
        $this->customer_data  = $customer_data;
        $this->find[ ]        = '{customer_name}';
        $this->replace[ ]     = $customer_data['name'];
        
        $admin_email = get_option('admin_email');
        // Get the user by email
        $admin_user = get_user_by('email', $admin_email);
        if ($admin_user) {
            // Return the display name of the admin user
            $this->admin = $admin_user->display_name;
        }
        
        if ( ! $this->is_enabled() || ! $this->get_recipient() ) {
            return;
        }
            
        $this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );
    }

    /**
     * Get email subject.
     *
     * @access  public
     * @return string
     */
    public function get_default_subject() {
        return apply_filters( 'request_send_email_subject', __( 'New Quote Request from {customer_name}', 'woocommerce-catalog-enquiry-pro' ), $this->object );
    }

    /**
     * Get email heading.
     *
     * @access  public
     * @return string
     */
    public function get_default_heading() {
        return apply_filters( 'request_send_email_heading', __( "New Quote Submitted by {customer_name} - Please Review", 'woocommerce-catalog-enquiry-pro' ), $this->object );
    }

    /**
     * get_content_html function.
     *
     * @access public
     * @return string
     */
    function get_content_html() {
        ob_start();
        wc_get_template( $this->template_html, [ 
            'email_heading'     => $this->get_heading(),
            'products'           => $this->products,
            'customer_email'    => $this->recipient,
            'customer_data'     => $this->customer_data,
            'admin'             => $this->admin,
            'sent_to_admin'     => false,
            'plain_text'        => false,
            'email'             => $this,
        ], '', $this->template_base );
        return ob_get_clean();
    }

    /**
     * get_content_plain function.
     *
     * @access public
     * @return string
     */
    function get_content_plain() {
        ob_start();
        wc_get_template( $this->template_plain, [ 
            'email_heading'     => $this->get_heading(),
            'products'           => $this->products,
            'customer_email'    => $this->recipient,
            'customer_data'     => $this->customer_data,
            'admin'             => $this->admin,
            'sent_to_admin'     => false,
            'plain_text'        => true,
            'email'             => $this,
        ],'', $this->template_base );
        return ob_get_clean();
    }
}
}
