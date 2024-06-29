<?php

namespace CatalogEnquiry;

class Admin
{

    public $settings;

    public function __construct()
    {
        add_action('admin_menu', array($this, 'add_menu'));
        add_action('admin_enqueue_scripts', array($this, 'catalog_admin_enqueue_scripts'));
        // $this->init_product_settings();
    }

    public function add_menu()
    {
        global $submenu;
        add_menu_page(
            __('catalog', 'woocommerce-catalog-enquiry'),
            __('Catalog', 'woocommerce-catalog-enquiry'),
            'manage_woocommerce',
            'catalog',
            [$this, 'mvx_catalog_callback'],
            'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill="#9EA3A8" fill-rule="nonzero"><path d="M7.8,5.4c0,0.5-0.4,0.9-0.9,0.9C6.6,6.3,6.3,6,6.1,5.7c0-0.1-0.1-0.2-0.1-0.3    c0-0.5,0.4-0.9,0.9-0.9c0.1,0,0.2,0,0.3,0.1C7.6,4.7,7.8,5,7.8,5.4z M5,7.4c-0.1,0-0.2,0-0.2,0c-0.6,0-1.1,0.5-1.1,1.1    C3.6,9,4,9.4,4.4,9.6c0.1,0,0.2,0.1,0.3,0.1c0.6,0,1.1-0.5,1.1-1.1C5.9,7.9,5.5,7.5,5,7.4z M5.8,1.7c-0.6,0-1,0.5-1,1s0.5,1,1,1    s1-0.5,1-1S6.3,1.7,5.8,1.7z M2.9,2.1c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5S3.2,2.1,2.9,2.1z M0.8,5.7    C0.3,5.7,0,6.1,0,6.5s0.3,0.8,0.8,0.8s0.8-0.3,0.8-0.8S1.2,5.7,0.8,5.7z M20,10.6c-0.1,4.3-3.6,7.7-7.9,7.7c-1.2,0-2.3-0.3-3.4-0.7    l-3.5,0.6l1.4-2c-1.5-1.4-2.5-3.5-2.5-5.7c0-0.2,0-0.4,0-0.5c0.3,0.1,0.6,0.1,0.9,0C5.9,9.7,6.4,9,6.3,8.3c0-0.2-0.1-0.4-0.2-0.5    C5.7,7,4.9,6.8,4.2,6.9C4,7,3.8,7,3.7,7C3,6.9,2.5,6.4,2.4,5.8c-0.2-1,0.6-1.9,1.6-1.9C4.6,4,5.1,4.4,5.3,5c0,0.1,0,0.2,0,0.2    c0.1,0.5,0.4,1,0.9,1.2c0.2,0.1,0.5,0.2,0.7,0.2c0.7,0,1.3-0.6,1.3-1.3c0-0.5-0.3-1-0.8-1.2c1.4-1.1,3.2-1.7,5.1-1.6    C16.7,2.8,20.1,6.3,20,10.6z M14.9,8.2c0-0.3-0.2-0.5-0.5-0.5H9.9c-0.3,0-0.5,0.2-0.5,0.5v4.6c0,0.3,0.2,0.5,0.5,0.5h2.6l0.5,1.1    h1.2l-0.5-1.1h0.9c0.3,0,0.5-0.2,0.5-0.5V8.2z M10.4,12.2h1.6l-0.3-0.6l0.9-0.4l0.5,1h0.8V8.7h-3.5V12.2z"/></g></svg>'),
            50
        );

        add_submenu_page(
            'catalog',
            __('Enquiry Messages', 'woocommerce-catalog-enquiry'),
            __('Enquiry Messages', 'woocommerce-catalog-enquiry'),
            'manage_woocommerce',
            'catalog#&tab=enquiry-messages',
            '__return_null'
        );

        add_submenu_page(
            'catalog',
            __('Quote Requests', 'woocommerce-catalog-enquiry'),
            __('Quote Requests', 'woocommerce-catalog-enquiry'),
            'manage_woocommerce',
            'catalog#&tab=quote-requests',
            '__return_null'
        );

        add_submenu_page(
            'catalog',
            __('Settings', 'woocommerce-catalog-enquiry'),
            __('Settings', 'woocommerce-catalog-enquiry'),
            'manage_woocommerce',
            'catalog#&tab=settings&subtab=all_settings',
            '__return_null'
        );

        add_submenu_page(
            'catalog',
            __('Modules', 'woocommerce-catalog-enquiry'),
            __('Modules', 'woocommerce-catalog-enquiry'),
            'manage_woocommerce',
            'catalog#&tab=modules',
            '__return_null'
        );

        if (apply_filters('mvx_catalog_free_only_active', true)) {
            $submenu['catalog'][] = [__('
          <style>
					a:has(.upgrade-to-pro){
						background: linear-gradient(-28deg, #f6a091, #bb939c, #5f6eb3) !important;
						color: White !important;
					};
				</style>
          <div class="upgrade-to-pro"><i style="margin-right: 0.25rem" class="dashicons dashicons-awards"></i>Upgrade to pro</div>', 'woocommerce-catalog-enquiry'), 'manage_woocommerce', 'https://multivendorx.com/woocommerce-request-a-quote-product-catalog/'];
        }

        remove_submenu_page('catalog', 'catalog');
    }

    public function mvx_catalog_callback()
    {
        echo '<div id="admin-catalog"></div>';
    }

    public function catalog_admin_enqueue_scripts()
    {
        wp_enqueue_media();
        $pages_array = $role_array = $all_users = $all_products = $all_product_cat = $all_product_tag = [];
        $pages = get_pages();
        if ($pages) {
            foreach ($pages as $page) {
                $pages_array[] = array(
                    'value' => $page->ID,
                    'label' => $page->post_title,
                    'key' => $page->ID,
                );
            }
        }

        if (wp_roles()->roles) {
            foreach (wp_roles()->roles as $key => $element) {
                $role_array[] = array(
                    'value' => $key,
                    'label' => $element['name'],
                    'key' => $key,
                );
            }
        }

        $users = get_users();
        foreach ($users as $user) {
            $all_users[] = array(
                'value' => $user->data->ID,
                'label' => $user->data->display_name,
                'key' => $user->data->ID,
            );
        }

        $args = apply_filters('woocommerce_catalog_limit_backend_product', array('posts_per_page' => -1, 'post_type' => 'product', 'post_status' => 'publish', 'orderby' => 'title', 'order' => 'ASC'));
        $woocommerce_product = get_posts($args);
        foreach ($woocommerce_product as $post => $value) {
            $all_products[] = array(
                'value' => $value->ID,
                'label' => $value->post_title,
                'key' => $value->ID,
            );
        }

        $args_cat = array('orderby' => 'name', 'order' => 'ASC');
        $terms = get_terms('product_cat', $args_cat);
        if ($terms && empty($terms->errors)) {
            foreach ($terms as $term) {
                if ($term) {
                    $all_product_cat[] = array(
                        'value' => $term->term_id,
                        'label' => $term->name,
                        'key' => $term->term_id,
                    );
                }
            }
        }

        $args_tag = array('hide_empty' => false,);
        $tags = get_terms( 'product_tag', $args_tag );
        if ($tags) {
            foreach ($tags as $tag) {
                $all_product_tag[] = array(
                    'value' => $tag->term_id,
                    'label' => $tag->name,
                    'key' => $tag->term_id,
                );
            }
        } 

        $current_user = wp_get_current_user();
        if (!empty($current_user->roles) && is_array($current_user->roles)) {
            $role = $current_user->roles [0];
        }
        // Get all tab setting's database value
        $settings_databases_value = $active_modules = [];
        $active_modules = Catalog()->modules->get_active_modules();
        $tabs_names = ['enquiry_catalog_customization', 'all_settings', 'enquiry_form_customization', 'enquiry_quote_exclusion', 'tools', 'enquiry_email_temp'];
        foreach ($tabs_names as $tab_name) {
            $settings_databases_value[$tab_name] = Catalog()->setting->get_option('catalog_' . $tab_name . '_settings');
        }
        if (get_current_screen()->id == 'toplevel_page_catalog') {
            wp_enqueue_style('mvx-catalog-style', Catalog()->plugin_url . '/build/index.css');
            wp_enqueue_script('mvx-catalog-script', Catalog()->plugin_url . '/build/index.js', array('wp-element'), '1.0.0', true);
            wp_localize_script('mvx-catalog-script', 'appLocalizer', apply_filters('catalog_settings', [
                'apiUrl'      => untrailingslashit(get_rest_url()),
                'nonce'       => wp_create_nonce('wp_rest'),
                'pages_array' => $pages_array,
                'role_array' => $role_array,
                'all_users' => $all_users,
                'all_products' => $all_products,
                'all_product_cat' => $all_product_cat,
                'all_product_tag' => $all_product_tag,
                'settings_databases_value' => $settings_databases_value,
                'active_modules' => $active_modules,
                'user_role'     => $role,
                'nonce' => wp_create_nonce('wp_rest'),
                'banner_img'  => Catalog()->plugin_url . 'assets/images/catalog-pro-add-admin-banner.jpg',
                'template1' => Catalog()->plugin_url . 'assets/images/email/templates/default_wc_tpl.png',
                'template2' => Catalog()->plugin_url . 'assets/images/email/templates/woocommerce_catalog_send_email_tpl_1.png',
                'template3' => Catalog()->plugin_url . 'assets/images/email/templates/woocommerce_catalog_send_email_tpl_2.png',
                'template4' => Catalog()->plugin_url . 'assets/images/email/templates/woocommerce_catalog_send_email_tpl_3.png',
                'template5' => Catalog()->plugin_url . 'assets/images/email/templates/woocommerce_catalog_send_email_tpl_4.png',
                'template6' => Catalog()->plugin_url . 'assets/images/email/templates/woocommerce_catalog_send_email_tpl_5.png',
                'template7' => Catalog()->plugin_url . 'assets/images/email/templates/woocommerce_catalog_send_email_tpl_6.png',
                'pro_active'    =>  apply_filters('mvx_catalog_free_only_active', true)
            ]));
        }
    }

    public function init_product_settings()
    {
        global $Woocommerce_Catalog_Enquiry;
        $settings = $Woocommerce_Catalog_Enquiry->options_general_settings;
        $options_button_appearence_settings = $Woocommerce_Catalog_Enquiry->options_button_appearence_settings;
        if (isset($settings['is_enable']) && mvx_catalog_get_settings_value($settings['is_enable'], 'checkbox') == "Enable") {
            if (isset($options_button_appearence_settings['button_type']) && mvx_catalog_get_settings_value($options_button_appearence_settings['button_type'], 'select') == 3) {
                add_filter('woocommerce_product_data_tabs', array($this, 'catalog_product_data_tabs'), 99);
                add_action('woocommerce_product_data_panels', array($this, 'catalog_product_data_panel'));
                add_action('woocommerce_process_product_meta_simple', array($this, 'save_catalog_data'));
                add_action('woocommerce_process_product_meta_grouped', array($this, 'save_catalog_data'));
                add_action('woocommerce_process_product_meta_external', array($this, 'save_catalog_data'));
                add_action('woocommerce_process_product_meta_variable', array($this, 'save_catalog_data'));
            }
        }
    }

    public function catalog_product_data_tabs($tabs)
    {
        $tabs['woocommerce_catalog_enquiry'] = array(
            'label' => __('Catalog Enquiry', 'woocommerce-catalog-enquiry'),
            'target' => 'woocommerce-catalog-enquiry-product-data',
            'class' => array(''),
        );
        return $tabs;
    }

    /**
     * Save meta.
     *
     * Save the product catalog enquiry meta data.
     *
     * @since 1.0.0
     *
     * @param int $post_id ID of the post being saved.
     */
    public function save_catalog_data($post_id)
    {
        update_post_meta($post_id, 'woocommerce_catalog_enquiry_product_link', esc_url($_POST['woocommerce_catalog_enquiry_product_link']));
    }

    /**
     * Output catalog individual product link.
     *
     * Output settings to the product link tab.
     *
     * @since 1.0.0
     */
    public function catalog_product_data_panel()
    {
?><div id="woocommerce-catalog-enquiry-product-data" class="panel woocommerce_options_panel"><?php
                                                                                                woocommerce_wp_text_input(array(
                                                                                                    'id' => 'woocommerce_catalog_enquiry_product_link',
                                                                                                    'label' => __('Enter product external link', 'woocommerce-catalog-enquiry'),
                                                                                                    'placeholder' => __('https://www.google.com', 'woocommerce-catalog-enquiry')
                                                                                                ));
                                                                                                ?></div><?php
                                                                                                    }
                                                                                                }
