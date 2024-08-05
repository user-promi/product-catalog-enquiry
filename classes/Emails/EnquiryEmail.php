<?php

namespace CatalogEnquiry\Emails;
use CatalogEnquiry\Utill;

/**
 * Email to Admin for customer enquiry
 * An email will be sent to the admin when customer enquiry about a product.
 *
 * @class 		Enquiry_Sent_Email
 * @version		3.0.2
 * @author 		MultiVendorX
 * @extends 	\WC_Email
 */
class EnquiryEmail extends \WC_Email {
	
	public $product_id;
	public $attachments;
	public $enquiry_data;
	public $cust_name;
	public $cust_email;

	/**
	 * Constructor
	 * @access public
	 * @return void
	 */
	function __construct() {		
		$this->id 				= 'catalog_enquiry_sent';
		$this->title 			= __( 'Enquiry sent', 'woocommerce-catalog-enquiry' );
		$this->description		= __( 'Admin will get an email when customer enquiry about a product', 'woocommerce-catalog-enquiry' );

		if (Utill::is_pro_active()) { 
			$email_setting = Catalog()->setting->get_setting( 'selected_email_tpl' );
			if ($email_setting) {
				if ($email_setting == 'template1') {
					$this->template_html 	= 'emails/default-enquiry-template.php';
				} elseif ($email_setting == 'template2') {
					$this->template_html 	= 'emails/enquiry-template1.php';
				} elseif ($email_setting == 'template3') {
					$this->template_html 	= 'emails/enquiry-template2.php';
				} elseif ($email_setting == 'template4') {
					$this->template_html 	= 'emails/enquiry-template3.php';
				} elseif ($email_setting == 'template5') {
					$this->template_html 	= 'emails/enquiry-template4.php';
				} elseif ($email_setting == 'template6') {
					$this->template_html 	= 'emails/enquiry-template5.php';
				} elseif ($email_setting == 'template7') {
					$this->template_html 	= 'emails/enquiry-template6.php';
				}
				$this->template_plain 	= 'emails/plain/enquiry-email-plain.php';
				$this->template_base 	= Catalog_PRO()->plugin_path . 'templates/';

			} else {
				$this->template_html 	= 'emails/woocommerce-catalog-enquiry-admin.php';
				$this->template_plain 	= 'emails/plain/woocommerce-catalog-enquiry-admin.php';
				$this->template_base 	= Catalog()->plugin_path . 'templates/';
			}
		} else {
			$this->template_html 	= 'emails/woocommerce-catalog-enquiry-admin.php';
			$this->template_plain 	= 'emails/plain/woocommerce-catalog-enquiry-admin.php';

			$this->template_base 	= Catalog()->plugin_path . 'templates/';
		}
		
		
		// Call parent constuctor
		parent::__construct();
	}

	/**
	 * trigger function.
	 * @access public
	 * @return bool
	 */
	function trigger( $recipient, $enquiry_data ) {
		
		$this->recipient 		= $recipient;
		$this->product_id 		= $enquiry_data[ 'product_id' ];
		$this->enquiry_data 	= $enquiry_data;
		$this->cust_name 		= $enquiry_data[ 'user_name' ];
		$this->cust_email 		= $enquiry_data[ 'user_email' ];
		$this->customer_email 	= $this->cust_email;
		
		if ( ! $this->is_enabled() || ! $this->get_recipient() ) {
			return false;
		}
		$product = wc_get_product( $this->product_id );

		$this->find[]      = '{PRODUCT_NAME}';
		$this->replace[]   =  is_array($this->product_id) && count($this->product_id) > 1 ? 'MULTIPLE PRODUCTS' : $product->get_title();
		$this->find[]      = '{USER_NAME}';
		$this->replace[]   = $enquiry_data['user_name'];

		return $this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );
	}

	/**
	 * Get email subject.
	 * @since  1.4.7
	 * @return string
	 */
	public function get_default_subject() {
		return apply_filters( 'woocommerce_catalog_enquiry_admin_email_subject', __( 'Product Enquiry for {PRODUCT_NAME} by {USER_NAME}', 'woocommerce-catalog-enquiry'), $this->object );
	}

	/**
	 * Get email heading.
	 * @since  1.4.7
	 * @return string
	 */
	public function get_default_heading() {
		return apply_filters( 'woocommerce_catalog_enquiry_admin_email_heading', __( 'Enquiry for {PRODUCT_NAME}', 'woocommerce-catalog-enquiry'),$this->object );
	}


	/**
     * Get email attachments.
     * @return string
     */
    // public function get_attachments() {
    //     return apply_filters( 'woocommerce_catalog_enquiry_admin_email_attachments', $this->attachments, $this->id, $this->object );
    // }

	/**
	 * Get email headers.
	 * @return string
	 */
	public function get_headers() {
		$header = "Content-Type: " . $this->get_content_type() . "\r\n";
		$header .= 'Reply-to: ' . $this->cust_name . ' <' . $this->cust_email . ">\r\n";
		
		return apply_filters( 'woocommerce_catalog_enquiry_admin_email_headers', $header, $this->id, $this->object );
	}


	/**
	 * get_content_html function.
	 * @return string
	 */
	function get_content_html() {
		ob_start();

		wc_get_template( $this->template_html, [
			'email_heading' 	=> $this->get_heading(),
			'product_id' 		=> $this->product_id,
			'enquiry_data' 		=> $this->enquiry_data,
			'customer_email' 	=> $this->customer_email,
			'sent_to_admin' 	=> true,
			'plain_text' 		=> false
		], '', $this->template_base );

		return ob_get_clean();
	}

	/**
	 * get_content_plain function.
	 * @return string
	 */
	function get_content_plain() {
		ob_start();

		wc_get_template( $this->template_plain, [
			'email_heading' 	=> $this->get_heading(),
			'product_id' 		=> $this->product_id,
			'enquiry_data' 		=> $this->enquiry_data,
			'customer_email' 	=> $this->customer_email,
			'sent_to_admin' 	=> true,
			'plain_text' 		=> true
		] ,'', $this->template_base );

		return ob_get_clean();
	}
}
