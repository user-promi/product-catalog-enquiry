<?php

namespace CatalogEnquiry;
use Automattic\Jetpack\Connection\Utils;

/**
 * Catalog enquiry class main function
 *
 * @class 		Enquiry_Sent_Email
 * @version		3.0.2
 * @author 		MultiVendorX
 * @extends 	\WC_Email
 */

final class CatalogEnquiry {

	private static $instance = null;
    private $file            = '';
    private $container       = [];
	
	/**
	 * Catalog enqueiry class constructor function
	 * @param mixed $file plugin's main file
	 */
	public function __construct($file) {
		require_once trailingslashit( dirname( $file ) ) . '/config.php';

		$this->file = $file;
        $this->container[ 'plugin_url' ]     = trailingslashit( plugins_url( '', $plugin = $file ) );
        $this->container[ 'plugin_path' ]    = trailingslashit( dirname( $file ) );
        $this->container[ 'version' ]        = WOOCOMMERCE_CATALOG_ENQUIRY_PLUGIN_VERSION;
        $this->container[ 'rest_namespace' ] = WOOCOMMERCE_CATALOG_ENQUIRY_REST_NAMESPACE;
		$this->container[ 'text_domain' ]    = WOOCOMMERCE_CATALOG_ENQUIRY_TEXT_DOMAIN;

		// $exclusion_user_list = $array = array(
		// 	array(
		// 		"value" => 15,
		// 		"label" => "lml test",
		// 		"index" => 0
		// 	),
		// 	array(
		// 		"value" => 4,
		// 		"label" => "Joe Blogs",
		// 		"index" => 2
		// 	),
		// 	array(
		// 		"value" => 17,
		// 		"label" => "mvx-admin",
		// 		"index" => 5
		// 	),
		// 	array(
		// 		"value" => 7,
		// 		"label" => "Narayan Patil",
		// 		"index" => 7
		// 	),
		// 	array(
		// 		"value" => 8,
		// 		"label" => "test_vendor",
		// 		"index" => 10
		// 	),
		// 	array(
		// 		"value" => 6,
		// 		"label" => "ravi",
		// 		"index" => 8
		// 	)
		// );

		// $exclusion_user_list = array_map(function ($user_list) {
		// 	return [
		// 		'key'   => $user_list[ 'value' ],
		// 		'label' => $user_list[ 'label' ],
		// 		'value'	=> $user_list[ 'value' ],
		// 	];
		// }, $exclusion_user_list );

		// echo ("<pre>");
		// print_r($exclusion_user_list);
		// die();

        register_activation_hook( $file, [ $this, 'activate' ] );
		register_deactivation_hook( $file, [ $this, 'deactivate' ] );

        add_action( 'before_woocommerce_init', [ $this, 'declare_compatibility' ] );
        add_action( 'woocommerce_loaded', [ $this, 'init_plugin' ] );
        add_action( 'plugins_loaded', [ $this, 'is_woocommerce_loaded'] );
		add_filter( 'woocommerce_email_classes', [ $this, 'load_emails' ] );
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
            add_filter('plugin_action_links_' . plugin_basename($file), [ $this, 'plugin_link' ] );
            add_filter('plugin_action_links_' . plugin_basename($file), [ $this, 'plugin_link' ] );
			add_filter( 'plugin_row_meta', [ $this, 'plugin_row_meta'], 10, 2 );
        }

		$this->init_classes();
		
		add_action( 'init', [ $this, 'catalog_register_strings' ] );
		add_action( 'init', [ $this, 'catalog_register_form_strings' ] );
		add_action( 'init', [ $this, 'catalog_setup_wizard' ] );
		
		add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_assets']);
		add_action('wp_enqueue_scripts', [$this, 'enqueue_block_assets']);

		do_action( 'catalog_enquiry_loaded' );


	}

	// function enqueue_block_assets() {

	// 	wp_enqueue_script(
	// 		'quote-cart-block',
	// 		Catalog()->plugin_url . 'build/blocks/quoteListTable/index.js',
	// 		[ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', ]
	// 	);

	// 	wp_localize_script(
	// 		'quote-cart-block', 'appLocalizer', [
	// 		'apiurl' => untrailingslashit(get_rest_url()),
	// 		'nonce' => wp_create_nonce( 'wp_rest' ),
	// 	]);
	
	// 	wp_enqueue_style(
	// 		'quote-cart-block-style',
	// 		Catalog()->plugin_url . 'build/blocks/quoteListTable/index.css',
	// 		[],
	// 	);

	// 	wp_enqueue_script(
	// 		'enquiry-button-block',
	// 		Catalog()->plugin_url . 'build/blocks/enquiryButton/index.js',
	// 		[ 'wp-blocks', 'wp-element', 'wp-editor' ],
	// 		true
	// 	);

	// 	wp_enqueue_script(
	// 		'quote-button-block',
	// 		Catalog()->plugin_url . 'build/blocks/quoteButton/index.js',
	// 		[ 'wp-blocks', 'wp-element', 'wp-editor' ],
	// 		true
	// 	);

	// 	wp_localize_script(
	// 		'quote-button-block', 'quote_button', [
	// 		'ajaxurl' => admin_url('admin-ajax.php'),
	// 	]);

	// }

	function enqueue_block_assets() {

		$scripts = [
			[
				'handle' => 'quote-cart-block',
				'src'    => Catalog()->plugin_url . 'build/blocks/quoteListTable/index.js',
				'deps'   => [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ],
				'localize' => [
					'object_name' => 'appLocalizer',
					'data' => [
						'apiurl' => untrailingslashit(get_rest_url()),
						'restUrl' => 'catalog/v1',
						'nonce'  => wp_create_nonce('wp_rest'),
					],
				],
			],
			[
				'handle' => 'enquiry-button-block',
				'src'    => Catalog()->plugin_url . 'build/blocks/enquiryButton/index.js',
				'deps'   => [ 'wp-blocks', 'wp-element', 'wp-editor' ],
			],
			[
				'handle' => 'quote-button-block',
				'src'    => Catalog()->plugin_url . 'build/blocks/quoteButton/index.js',
				'deps'   => [ 'wp-blocks', 'wp-element', 'wp-editor' ],
				'localize' => [
					'object_name' => 'quote_button',
					'data' => [
						'ajaxurl' => admin_url('admin-ajax.php'),
					],
				],
			]
		];
	
		foreach ($scripts as $script) {
			wp_enqueue_script($script['handle'], $script['src'], $script['deps']);
			if (isset($script['localize'])) {
				wp_localize_script($script['handle'], $script['localize']['object_name'], $script['localize']['data']);
			}
		}
	
		wp_enqueue_style('quote-cart-block-style', Catalog()->plugin_url . 'build/blocks/quoteListTable/index.css');

        wp_enqueue_style('mvx-catalog-style', Catalog()->plugin_url . '/build/index.css');

	}
	
	/**
	 * Load setup class 
	 */
	function catalog_setup_wizard() {
		
		new SetupWizard();
		if (get_option('catalog_plugin_activated')) {
			delete_option('catalog_plugin_activated');
			wp_redirect(admin_url('admin.php?page=catalog-setup'));
			exit;
		}
	
	}

	function catalog_register_strings() {
		if ( function_exists( 'icl_register_string' ) ) {
			icl_register_string( 'woocommerce-catalog-enquiry', 'add_to_quote', 'Add to Quote' );
			icl_register_string( 'woocommerce-catalog-enquiry', 'view_quote', 'View Quote' );
			icl_register_string( 'woocommerce-catalog-enquiry', 'send_an_enquiry', 'Send an enquiry' );
		}
	}

	function catalog_register_form_strings() {
		$form_settings =  Catalog()->setting->get_option('catalog_enquiry_form_customization_settings');

		if ( function_exists( 'icl_register_string' ) ) {
			foreach ( $form_settings['formsettings']['formfieldlist'] as $field ) {
				if ( isset( $field['label'] ) ) {
					icl_register_string( 'woocommerce-catalog-enquiry', 'form_field_label_' . $field['id'], $field['label'] );
				}
				if ( isset( $field['placeholder'] ) ) {
					icl_register_string( 'woocommerce-catalog-enquiry', 'form_field_placeholder_' . $field['id'], $field['placeholder'] );
				}
				if ( isset( $field['options'] ) ) {
					foreach ( $field['options'] as $option ) {
						icl_register_string( 'woocommerce-catalog-enquiry', 'form_field_option_' . $field['id'] . '_' . $option['value'], $option['label'] );
					}
				}
			}
	
			foreach ( $form_settings['freefromsetting'] as $free_field ) {
				if ( isset( $free_field['label'] ) ) {
					icl_register_string( 'woocommerce-catalog-enquiry', 'free_form_label_' . $free_field['key'], $free_field['label'] );
				}
			}
		}

		// Save the form settings to the options table
		update_option( 'catalog_enquiry_form_customization_settings', $form_settings );
	}

	public function init_classes() {
		$this->container['setting']  	= new Setting();
        $this->container['admin']    	= new Admin();
        $this->container['frontend'] 	= new Frontend();
		$this->container['restapi']	 	= new Rest();
		$this->container['util']     	= new Utill();
		$this->container['modules']	 	= new Modules();
		$this->container['shortcode']	= new Shortcode();
		// $this->container['block'] 		= new Block();
		$this->container['session'] 	= new Core\Session();
        $this->container['quotecart']	= new Core\QuoteCart();

		// Load all active modules
		$this->container['modules']->load_active_modules();
	}

	function plugin_link( $links ) {	
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

	/**
     * Take action based on if woocommerce is not loaded
     * @return void
     */
    public function is_woocommerce_loaded() {
        if ( ! did_action( 'woocommerce_loaded' ) && is_admin() ) {
        	add_action( 'admin_notices', [ $this , 'woocommerce_admin_notice' ] );
        }
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
	 * Catalog enquery emails
	 * @param array $emails
	 * @return array
	 */
	public function load_emails( $emails ) {
		$emails[ 'EnquiryEmail' ] = new Emails\EnquiryEmail();
		$emails[ 'requestQuoteSendEmail' ]  = new Emails\RequestQuoteSendEmail();
		return $emails;
	}

	/**
     *Catalog enquery activation function.
     * @return void
     */
	public function activate() {
		ob_start();
		$this->container['install'] = new Install();

		if (!get_option('catalog_plugin_installed')) {
			add_option('catalog_plugin_installed', true);
			add_option('catalog_plugin_activated', true);
		}
        flush_rewrite_rules();
		ob_end_clean();
    }

	/**
     *Catalog enquery deactivation function.
     * @return void
     */
    public function deactivate() {
        
    }

	/**
	 * Load Localisation files.
	 * Note: the first-loaded translation file overrides any following ones if the same translation is present
	 * @return void
	 */
	public function load_plugin_textdomain() {

		$locale = is_admin() && function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale();
		$locale = apply_filters( 'woocommerce_catalog_enquiry_plugin_locale', $locale, 'woocommerce-catalog-enquiry' );

		load_textdomain( 'woocommerce-catalog-enquiry', WP_LANG_DIR . '/woocommerce-catalog-enquiry/woocommerce-catalog-enquiry-' . $locale . '.mo' );
		load_plugin_textdomain('woocommerce-catalog-enquiry', false, plugin_basename( dirname( dirname( __FILE__ ) ) ) . '/languages' );
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
        return new \WP_Error( sprintf('Call to unknown class %s.', $class ) );
    }

	/**
     * Initializes the catalog enquiry class.
     * Checks for an existing instance
     * And if it doesn't find one, create it.
     * @param mixed $file
     * @return object | null
     */
	public static function init( $file ) {
        if ( self::$instance === null ) {
            self::$instance = new self( $file );
        }

        return self::$instance;
    }
}
