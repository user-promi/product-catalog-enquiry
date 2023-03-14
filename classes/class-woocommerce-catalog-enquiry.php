<?php
class Woocommerce_Catalog_Enquiry {

	public $plugin_url;

	public $plugin_path;

	public $version;

	public $token;
	
	public $text_domain;
	
	public $library;

	public $shortcode;

	public $admin;

	public $frontend;

	public $template;

	public $ajax;

	private $file;
	
	public $settings;
		
	public $options;
	
	public $options_exclusion_settings ;
	
	public $options_button_appearence_settings;

	public function __construct($file) {

		$this->file = $file;
		$this->plugin_url = trailingslashit(plugins_url('', $plugin = $file));
		$this->plugin_path = trailingslashit(dirname($file));
		$this->token = WOOCOMMERCE_CATALOG_ENQUIRY_PLUGIN_TOKEN;
		$this->text_domain = WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN;
		$this->version = WOOCOMMERCE_CATALOG_ENQUIRY_PLUGIN_VERSION;
		// default general setting
		$this->options_general_settings = get_option('mvx_catalog_general_tab_settings');	
		// from_setting
		$this->options_form_settings = get_option('mvx_catalog_enquiry_form_tab_settings');
		// exclusion setting
		$this->options_exclusion_settings = get_option('mvx_catalog_exclusion_tab_settings');
		// button appearence
		$this->options_button_appearence_settings = get_option('mvx_catalog_button_appearance_tab_settings');
		add_action('init', array(&$this, 'init'), 0);
		// Catalog Email setup
		add_filter('woocommerce_email_classes', array(&$this, 'woocommerce_catalog_enquiry_email_setup' ));
		add_action( 'rest_api_init', array( $this, 'catalog_rest_routes_react_module' ) );
	}
	
	/**
	 * initilize plugin on WP init
	 */
	function init() {
		
		// Init Text Domain
		$this->load_plugin_textdomain();

		// Init ajax
		if(defined('DOING_AJAX')) {
	      	$this->load_class('ajax');
	      	$this->ajax = new  Woocommerce_Catalog_Enquiry_Ajax();
	    }

		if (is_admin()) {
			$this->load_class('admin');
			$this->admin = new Woocommerce_Catalog_Enquiry_Admin();
		}

		if (!is_admin() || defined('DOING_AJAX')) {
			$this->load_class('frontend');
			$this->frontend = new Woocommerce_Catalog_Enquiry_Frontend();
		}

		if (!get_option('_is_dismiss_mvx_catalog340_notice', false) && current_user_can('manage_options')) {
            add_action('admin_notices', array(&$this, 'mvx_catalog_service_page_notice'));
        }
	}

	/**
     * Display WCMp service notice in admin panel
     */
    public function mvx_catalog_service_page_notice() {
        ?>
        <div class="updated mvx_catalog_admin_new_banner">
            <div class="round"></div>
            <div class="round1"></div>
            <div class="round2"></div>
            <div class="round3"></div>
            <div class="round4"></div>
            <div class="mvx_catalog_banner-content">
                <span class="txt"><?php esc_html_e('Presenting New and Improved Product Catalog Enquiry.', 'woocommerce-catalog-enquiry') ?>  </span>
                <div class="rightside">        
                    <a href="https://multivendorx.com/blog/6-new-changes-in-product-catalog-enquiry" target="_blank" class="mvx_catalog_btn_service_claim_now"><?php esc_html_e('View the latest addition.', 'woocommerce-catalog-enquiry'); ?></a>
                    <button onclick="dismiss_servive_notice(event);" type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
                </div>

            </div>
        </div>
        <style type="text/css">.clearfix{clear:both}.mvx_catalog_admin_new_banner.updated{border-left:0}.mvx_catalog_admin_new_banner{box-shadow:0 3px 1px 1px rgba(0,0,0,.2);padding:10px 30px;background:#fff;position:relative;overflow:hidden;clear:both;border-top:2px solid #8abee5;text-align:left;background-size:contain}.mvx_catalog_admin_new_banner .round{width:200px;height:200px;position:absolute;border-radius:100%;border:30px solid rgba(157,42,255,.05);top:-150px;left:73px;z-index:1}.mvx_catalog_admin_new_banner .round1{position:absolute;border-radius:100%;border:45px solid rgba(194,108,144,.05);bottom:-82px;right:-58px;width:180px;height:180px;z-index:1}.mvx_catalog_admin_new_banner .round2,.mvx_catalog_admin_new_banner .round3{border-radius:100%;width:180px;height:180px;position:absolute;z-index:1}.mvx_catalog_admin_new_banner .round2{border:18px solid rgba(194,108,144,.05);top:35px;left:249px}.mvx_catalog_admin_new_banner .round3{border:45px solid rgba(31,194,255,.05);top:2px;right:40%}.mvx_catalog_admin_new_banner .round4{position:absolute;border-radius:100%;border:31px solid rgba(31,194,255,.05);top:11px;left:-49px;width:100px;height:100px;z-index:1}.mvx_catalog_banner-content{display: -webkit-box;display: -moz-box;display: -ms-flexbox;display: -webkit-flex;display: flex;align-items:center}.mvx_catalog_admin_new_banner .txt{color:#333;font-size:15px;line-height:1.4;width:calc(100% - 345px);position:relative;z-index:2;display:inline-block;font-weight:400;float:left;padding-left:8px}.mvx_catalog_admin_new_banner .link,.mvx_catalog_admin_new_banner .mvx_catalog_btn_service_claim_now{font-weight:400;display:inline-block;z-index:2;padding:0 20px;position:relative}.mvx_catalog_admin_new_banner .rightside{float:right;width:345px}.mvx_catalog_admin_new_banner .mvx_catalog_btn_service_claim_now{cursor:pointer;background:#8abee5;height:40px;color:#fff;font-size:20px;text-align:center;border:none;margin:5px 13px;border-radius:5px;text-decoration:none;line-height:40px}.mvx_catalog_admin_new_banner button:hover{opacity:.8;transition:.5s}.mvx_catalog_admin_new_banner .link{font-size:18px;line-height:49px;background:0 0;height:50px}.mvx_catalog_admin_new_banner .link a{color:#333;text-decoration:none}@media (max-width:990px){.mvx_catalog_admin_new_banner::before{left:-4%;top:-12%}}@media (max-width:767px){.mvx_catalog_admin_new_banner::before{left:0;top:0;transform:rotate(0);width:10px}.mvx_catalog_admin_new_banner .txt{width:400px;max-width:100%;text-align:center;padding:0;margin:0 auto 5px;float:none;display:block;font-size:17px;line-height:1.6}.mvx_catalog_admin_new_banner .rightside{width:100%;padding-left:10px;text-align:center;box-sizing:border-box}.mvx_catalog_admin_new_banner .mvx_catalog_btn_service_claim_now{margin:10px 0}.mvx_catalog_banner-content{display:block}}.mvx_catalog_admin_new_banner button.notice-dismiss{z-index:1;position:absolute;top:50%;transform:translateY(-50%)}</style>
        <script type="text/javascript">
            function dismiss_servive_notice(e, i) {
                jQuery.post(ajaxurl, {action: "dismiss_mvx_catalog_servive_notice"}, function (e) {
                    e && (jQuery(".mvx_catalog_admin_new_banner").addClass("hidden"), void 0 !== i && (window.open(i, '_blank')))
                })
            }
        </script>
        <?php
    }

	function catalog_rest_routes_react_module() {
		// list of vendors on vendor tab section
        register_rest_route( 'mvx_catalog/v1', '/fetch_admin_tabs', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => array( $this, 'mvx_catalog_fetch_admin_tabs' ),
            'permission_callback' => array( $this, 'catalog_permission' )
        ] );

        register_rest_route( 'mvx_catalog/v1', '/save_enquiry', [
            'methods' => WP_REST_Server::EDITABLE,
            'callback' => array( $this, 'mvx_catalog_save_enquiry' ),
            'permission_callback' => array( $this, 'catalog_permission' )
        ] );
	}

	public function mvx_catalog_fetch_admin_tabs() {
		$mvx_catalog_tabs_data = mvx_catalog_admin_tabs() ? mvx_catalog_admin_tabs() : [];
        return rest_ensure_response( $mvx_catalog_tabs_data );
	}

	public function mvx_catalog_save_enquiry($request) {
        $all_details = [];
        $modulename = $request->get_param('modulename');
        $modulename = str_replace("-", "_", $modulename);
        $get_managements_data = $request->get_param( 'model' );
        $optionname = 'mvx_catalog_'.$modulename.'_tab_settings';
        update_option($optionname, $get_managements_data);
        $all_details['error'] = __('Settings Saved', 'woocommerce-catalog-enquiry');
        return $all_details;
        die;
	}
	
	public function catalog_permission() {
		return true;
	}

	/**
   * Load Localisation files.
   *
   * Note: the first-loaded translation file overrides any following ones if the same translation is present
   *
   * @access public
   * @return void
   */
  	public function load_plugin_textdomain() {
		$locale = is_admin() && function_exists('get_user_locale') ? get_user_locale() : get_locale();
		$locale = apply_filters('woocommerce_catalog_enquiry_plugin_locale', $locale, 'woocommerce-catalog-enquiry');
		load_textdomain('woocommerce-catalog-enquiry', WP_LANG_DIR . '/woocommerce-catalog-enquiry/woocommerce-catalog-enquiry-' . $locale . '.mo');
		load_plugin_textdomain('woocommerce-catalog-enquiry', false, plugin_basename(dirname(dirname(__FILE__))) . '/languages');
  	}

	public function load_class($class_name = '') {
		if ('' != $class_name && '' != $this->token) {
			require_once ('class-' . esc_attr($this->token) . '-' . esc_attr($class_name) . '.php');
		} // End If Statement
	}// End load_class()

	/**
	 * Add WC Catalog Email
	 *
	 * @param emails     default email classes
	 * @return modified email classes
	 */ 
	function woocommerce_catalog_enquiry_email_setup( $emails ) {
		require_once( 'emails/class-woocommerce-catalog-enquiry-email.php' );
		$emails['Woocommerce_Catalog_Enquiry_Email'] = new Woocommerce_Catalog_Enquiry_Email();
		
		return $emails;
	}
	
	/** Cache Helpers *********************************************************/

	/**
	 * Sets a constant preventing some caching plugins from caching a page. Used on dynamic pages
	 *
	 * @access public
	 * @return void
	 */
	function nocache() {
		if (!defined('DONOTCACHEPAGE'))
			define("DONOTCACHEPAGE", "true");
		// WP Super Cache constant
	}
}
