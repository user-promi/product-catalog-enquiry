<?php

namespace CatalogEnquiry;
use CatalogEnquiry\Enquiry\Module;

defined( 'ABSPATH' ) || exit;

class Block {
    private $blocks;

    public function __construct() {
        // Register the block
        add_action( 'init', [$this, 'register_blocks'] );
        // Enqueue the script and style for block editor
        add_action( 'enqueue_block_editor_assets', [ $this,'enqueue_block_assets'] );
        add_action( 'wp_enqueue_scripts', [ $this,'enqueue_block_assets'] );

        $current_user = wp_get_current_user();
        $this->blocks = [
            [
                'name' => 'enquiry-button', // block name
                'render_php_callback_function' => [$this, 'render_enquiry_button_block'], // php render calback function
                'required_script' => '', // the script which is required in the frontend of the block
                'required_scripts' => ['frontend_js', 'enquiry_form_js' ], // the scripts which are required in the frontend of the block
                'required_style'   => 'mvx-catalog-product-style', // the style which is required in the frontend of the block
                // src link is generated (which is append from block name) within the function
				'react_dependencies'   => ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'], // the react dependencies which required in js
                'localize' => [
					'object_name' => 'enquiryButton', // the localized variable name
                    // all the data that is required in index.js
					'data' => [
                        'apiUrl'  => '', // this set blank because in scope the get_rest_url() is not defined
                        'restUrl' => Catalog()->rest_namespace,
                        'nonce'   => wp_create_nonce( 'catalog-security-nonce' )
					],
				],
            ],
            [
                'name' => 'quote-button', // block name
                'render_php_callback_function' => '',
                'required_script' => '',
                'required_scripts' => '',
                'required_style'   => '',
                // src link is generated (which is append from block name) within the function
				'react_dependencies'   => ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                'localize' => [
					'object_name' => 'quote_button',
					'data' => [
                        'ajaxurl' => admin_url('admin-ajax.php'),
					],
				],
            ],
            [
                'name' => 'quote-cart', // block name
                'render_php_callback_function' => '',
                'required_script' => '',
                'required_scripts' => '',
                'required_style'   => 'quote-cart-block-style',
                // src link is generated (which is append from block name) within the function
				'react_dependencies'   => ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                'localize' => [
					'object_name' => 'quote_cart',
					'data' => [
                        'apiUrl' => '',
						'restUrl' => 'catalog/v1',
						'nonce'  => wp_create_nonce('wp_rest'),
                        'name'  => $current_user->display_name,
                        'email' => $current_user->user_email
					],
				],
            ],
            [
                'name' => 'quote-thank-you', // block name
                'render_php_callback_function' => '',
                'required_script' => '',
                'required_scripts' => '',
                'required_style'   => '',
                // src link is generated (which is append from block name) within the function
				'react_dependencies'   => ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                'localize' => [],
            ],
        ];
    }

    public function enqueue_block_assets() {

        foreach ($this->blocks as $block_script) {
			wp_enqueue_script($block_script['name'], Catalog()->plugin_url . 'build/blocks/' . $block_script['name'] . '/index.js', $block_script['react_dependencies'], Catalog()->version, true);
			if (isset($block_script['localize']) && !empty($block_script['localize'])) {
                $block_script['localize']['data']['apiUrl'] = untrailingslashit( get_rest_url() );
				wp_localize_script($block_script['name'], $block_script['localize']['object_name'], $block_script['localize']['data']);
			}
		}

        wp_enqueue_style('mvx-catalog-style', Catalog()->plugin_url . '/build/index.css');
    }
    
    public function register_blocks() {
    
        foreach ($this->blocks as $block) {
            register_block_type(Catalog()->text_domain . '/' . $block['name'], [
                'render_callback' => $block['render_php_callback_function'],
                'enqueue_scripts' => $block['required_scripts'],
                'style'           => $block['required_style'],
                'script'          => $block['required_style'],
            ]);
        }
    }

    public function render_enquiry_button_block($attributes) {
        ob_start();
        // Extract the productId from attributes
        $product_id = isset($attributes['productId']) ? intval($attributes['productId']) : null;

        Module::init()->frontend->add_enquiry_button($product_id);
    
        return ob_get_clean();
    }
    
}