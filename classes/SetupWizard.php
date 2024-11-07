<?php

namespace CatalogEnquiry;

/**
 * Setup Wizard Class
 * 
 */
if (!defined('ABSPATH')) {
    exit;
}

class SetupWizard {

    public function __construct() {

        add_action( 'admin_menu', [$this, 'admin_menus'] );
        add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts'] );
    }

    /**
     * Add admin menus/screens.
     */
    public function admin_menus() {
        add_dashboard_page('', '', 'manage_options', 'catalog-setup', [$this, 'render_setup_wizard']);
    }
    
    function render_setup_wizard() {
        ?>
        <div id="catalog_setup_wizard">
        </div>
        <?php
    }
    
    function admin_scripts() {
        $current_screen = get_current_screen();

        if ( $current_screen->id === 'dashboard_page_catalog-setup' ) {
            wp_enqueue_script('setup_wizard_js', Catalog()->plugin_url . 'build/blocks/setupWizard/index.js', [ 'jquery', 'jquery-blockui', 'wp-element', 'wp-i18n' ], Catalog()->version, true);
            wp_enqueue_style('setup_wizard_css', Catalog()->plugin_url . 'build/blocks/setupWizard/index.css');
            wp_localize_script(
                'setup_wizard_js', 'appLocalizer', [
                'apiurl' => untrailingslashit(get_rest_url()),
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'redirect_url' => admin_url() . 'admin.php?page=catalog#&tab=settings&subtab=all_settings',
            ]);
        }
    }

}
