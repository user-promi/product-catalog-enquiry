<?php
namespace CatalogEnquiry;
final class CatalogEnquiry {

	private static $instance = null;
    private $file            = '';
    private $container       = [];
	
	public function __construct($file) {
		require_once trailingslashit( dirname( $file ) ) . '/woocommerce-catalog-enquiry-config.php';

		$this->file = $file;
        $this->container[ 'plugin_url' ]     = trailingslashit( plugins_url( '', $plugin = $file ) );
        $this->container[ 'plugin_path' ]    = trailingslashit( dirname( $file ) );
        $this->container[ 'version' ]        = WOOCOMMERCE_CATALOG_ENQUIRY_PLUGIN_VERSION;
        $this->container[ 'rest_namespace' ] = WOOCOMMERCE_CATALOG_ENQUIRY_REST_NAMESPACE;

        register_activation_hook( $file, [ $this, 'activate' ] );
		register_deactivation_hook( $file, [ $this, 'deactivate' ] );

		// add_action( 'init', [ $this, 'load_modules'], 1 );
        add_action( 'before_woocommerce_init', [ $this, 'declare_compatibility' ] );
        add_action( 'woocommerce_loaded', [ $this, 'init_plugin' ] );
        add_action( 'plugins_loaded', [ $this, 'is_woocommerce_loaded'] );
		add_filter('woocommerce_email_classes', [ $this, 'woocommerce_catalog_enquiry_email_setup'] );

    }
	
	public static function init($file) {
        if ( self::$instance === null ) {
            self::$instance = new self($file);
        }
        return self::$instance;
    }

	// public function load_modules() {
	// 	$this->container['modules']	 = new Modules();
	// 	$this->container['modules']->load_active_modules();
	// }

	public function activate() {
		update_option( 'catalog_enquiry_installed', 1 );
		$this->container['install'] = new Install();
        flush_rewrite_rules();
    }

	/**
     * Placeholder for deactivation function.
     * @return void
     */
    public function deactivate() {
        delete_option( 'catalog_enquiry_installed' );
    }


	/**
     * Add High Performance Order Storage Support
     * @return void
     */
    public function declare_compatibility() {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility ( 'custom_order_tables', WP_CONTENT_DIR.'/plugins/woocommerce-catalog-enquiry/Woocommerce_Catalog_Enquiry.php', true );
        
    }

	public function init_plugin() {
		$this->load_plugin_textdomain();
		$file = $this->file;
		if (is_admin() && !defined('DOING_AJAX')) {
            add_filter('plugin_action_links_' . plugin_basename($file), [ $this, 'woocommerce_catalog_enquiry_plugin_links']);
			add_filter( 'plugin_row_meta', [ $this, 'plugin_row_meta'], 10, 2 );
        }

		$this->init_classes();
		do_action( 'catalog_enquiry_loaded' );

	}

	public function init_classes() {
		$this->container['setting']  = new Setting();
        $this->container['ajax']     = new Ajax();
        $this->container['admin']    = new Admin();
        $this->container['frontend'] = new Frontend();
		$this->container['rest']	 = new Rest();
		$this->container[ 'util' ]   = new Utill();
		$this->container['modules']	 = new Modules();
		$this->container['modules']->load_active_modules();
	}

	function woocommerce_catalog_enquiry_plugin_links( $links ) {	
		$plugin_links = array(
			'<a href="' . admin_url( 'admin.php?page=catalog#&tab=settings&subtab=general' ) . '">' . __( 'Settings', WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN ) . '</a>',
			'<a href="https://multivendorx.com/support-forum/forum/wcmp-catalog-enquiry/">' . __( 'Support', WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN ) . '</a>',			
		);	
		$links = array_merge( $plugin_links, $links );
		if ( apply_filters( 'woocommerce_catalog_enquiry_free_active', true ) ) {
			$links[] = '<a href="https://multivendorx.com/woocommerce-request-a-quote-product-catalog/" target="_blank">' . __( 'Upgrade to Pro', WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN ) . '</a>';
		}
		return $links;
	}

	function plugin_row_meta( $links, $file ) {
		if($file == 'woocommerce-catalog-enquiry/Woocommerce_Catalog_Enquiry.php' && apply_filters( 'woocommerce_catalog_enquiry_free_active', true )){
			$row_meta = array(
				'pro'    => '<a href="https://multivendorx.com/woocommerce-request-a-quote-product-catalog/" title="' . esc_attr( __( 'Upgrade to Pro', WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN ) ) . '">' . __( 'Upgrade to Pro', WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN ) . '</a>'
			);
			return array_merge( $links, $row_meta );
		}else{
			return $links;
		}
	}

	public function is_woocommerce_loaded() {
        if ( did_action( 'woocommerce_loaded' ) || ! is_admin() ) {
            return;
        }
        add_action('admin_notices', [$this, 'woocommerce_admin_notice']);
    }

    /**
     * Display Woocommerce inactive notice.
     * @return void
     */
    function woocommerce_admin_notice() {

        ?>
        <div class="error">
			<p><?php printf( __( '%sWoocommerce Catalog Enquiry is inactive.%s The %sWooCommerce plugin%s must be active for the Woocommerce Catalog Enquiry to work. Please %sinstall & activate WooCommerce%s', WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN ), '<strong>', '</strong>', '<a target="_blank" href="http://wordpress.org/extend/plugins/woocommerce/">', '</a>', '<a href="' . admin_url( 'plugins.php' ) . '">', '&nbsp;&raquo;</a>' ); ?></p>
        </div>
        <?php
    }

	/**
	 * initilize plugin on WP init
	 */
	// function init() {
		
	// 	// Init Text Domain
	// 	$this->load_plugin_textdomain();

	// 	// Init ajax
	// 	if(defined('DOING_AJAX')) {
	// 		$this->load_class('ajax');
	// 		$this->ajax = new  Woocommerce_Catalog_Enquiry_Ajax();
	// 	}

	// 	if (!is_admin() || defined('DOING_AJAX')) {
	// 		$this->load_class('template');
	// 		$this->template = new Woocommerce_Catalog_Enquiry_Template();
	// 	}

	// 	if (is_admin()) {
	// 		$this->load_class('admin');
	// 		$this->admin = new Woocommerce_Catalog_Enquiry_Admin();
	// 	}

	// 	if (!is_admin() || defined('DOING_AJAX')) {
	// 		$this->load_class('frontend');
	// 		$this->frontend = new Woocommerce_Catalog_Enquiry_Frontend();
	// 	}
	// }

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

	/**
     * Magic getter function to get the reference of class.
     * Accept class name, If valid return reference, else Wp_Error. 
     * @param   mixed $class
     * @return  object | \WP_Error
     */
    public function __get( $class ) {
        if ( array_key_exists( $class, $this->container ) ) {
            return $this->container[ $class ];
        } 
        return new \WP_Error( sprintf( 'Call to unknown class %s.', $class ) );
    }

	/**
	 * Add WC Catalog Email
	 *
	 * @param emails     default email classes
	 * @return modified email classes
	 */ 
	function woocommerce_catalog_enquiry_email_setup( $emails ) {
		require_once( 'emails/EnquirySent.php' );
		$emails['Enquiry_Sent_Email'] = new \Enquiry_Sent_Email();
		
		return $emails;
	}
	
}
