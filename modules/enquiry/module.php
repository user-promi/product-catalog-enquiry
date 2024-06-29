<?php 
namespace CatalogEnquiry\enquiry;
use CatalogEnquiry\Utill;
class Module {
    public $available_for;
    public function __construct() {
        add_action('init', [$this, 'main' ], 10);
        add_action('wp_enqueue_scripts', [ $this, 'frontend_scripts']);
        add_action('wp_enqueue_scripts', array($this, 'frontend_styles'));
        $this->available_for = '';
        $current_user = wp_get_current_user();
        $catalog_user_role_restriction = Catalog()->setting->get_option('catalog_enquiry_quote_exclusion_settings');
        if (isset($settings['enquiry_exclusion_userroles_list'])) {
            foreach ($catalog_user_role_restriction['enquiry_exclusion_userroles_list'] as $user_list_key) {
                $user_role_list[] = in_array( $user_list_key['key'], array_keys( wp_roles()->roles ) ) ? $user_list_key['key'] : '';
            }
            if ( !empty( $current_user->roles ) && !empty( $user_role_list ) && in_array($current_user->roles[0], $user_role_list)) {
                $this->available_for = $current_user->ID;
            }
        }
        if (isset($settings['enquiry_exclusion_user_list'])) {
            foreach ($catalog_user_role_restriction['enquiry_exclusion_user_list'] as $user_list_key) {
                if ($current_user->ID == intval($user_list_key['key'])) {
                    $this->available_for = $current_user->ID;                           
                }
            }
        }
    }

    function main() {
        if ($this->available_for == '') {
            $display_enquiry_button = Catalog()->setting->get_setting( 'display_enquiry_button_user_type' );

            if ($display_enquiry_button == 'all_users') {
                add_action('woocommerce_single_product_summary', [ $this, 'add_form_for_enquiry'], 10);
            } else if ($display_enquiry_button == 'logged_out' && !is_user_logged_in()) {
                add_action('woocommerce_single_product_summary', [ $this, 'add_form_for_enquiry'], 10);
            } else if ($display_enquiry_button == 'logged_in' && is_user_logged_in()) {
                add_action('woocommerce_single_product_summary', [ $this, 'add_form_for_enquiry'], 10);
            }
            
            add_action('wp_ajax_save_enquiry_send_mail', [$this, 'save_enquiry_send_mail']);
            add_action('wp_ajax_nopriv_save_enquiry_send_mail', [$this, 'save_enquiry_send_mail']);

            add_action( 'woocommerce_single_product_summary', array($this, 'catalog_woocommerce_template_single'), 5 );
        }
        
    }

    public function frontend_scripts() {
        wp_enqueue_script('frontend_js', Catalog()->plugin_url . 'modules/enquiry/assets/js/frontend.js', array( 'jquery', 'jquery-blockui' ), Catalog()->version, true);
        wp_localize_script(
            'frontend_js', 'catalog_enquiry_frontend', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce( 'wp_rest' ),
            'settings' => Catalog()->setting->get_setting( 'is_page_redirect' ),
            'ajax_success_msg' => __('Enquiry sent successfully', 'woocommerce-catalog-enquiry'),
            'redirect_link' => Catalog()->setting->get_setting( 'redirect_page_id' ) ? get_permalink(Catalog()->setting->get_setting( 'redirect_page_id' )) : '',
        ));
    }

    function frontend_styles() {
        wp_enqueue_style('frontend_css', Catalog()->plugin_url . 'modules/enquiry/assets/js/frontend.css', array(), Catalog()->version);
        
    
        if (Catalog()->setting->get_setting( 'custom_css_product_page' ) != "") {
            wp_add_inline_style('frontend_css', Catalog()->setting->get_setting( 'custom_css_product_page' ));
        }
    }

    public function catalog_woocommerce_template_single() { 
        global $post;
        $settings = Catalog()->setting->get_option('catalog_enquiry_quote_exclusion_settings');      

        $product_for = [];
        if (isset($settings['enquiry_exclusion_product_list'])) {
            foreach ($settings['enquiry_exclusion_product_list'] as $user_list_key) {
                if ($post->ID == $user_list_key['key']) {
                    $product_for[] = $post->ID;
                }
            }
        }  

        $category_for = [];
        $term_list = wp_get_post_terms($post->ID,'product_cat',array('fields'=>'ids'));
        if (isset($settings['enquiry_exclusion_category_list'])) {
            foreach ($settings['enquiry_exclusion_category_list'] as $user_list_key) {
                if ($user_list_key['key'] == $term_list[0]) {
                    $category_for[] = $post->ID;
                }
            }
        }

        $tag_for = [];
        $tag_term_list = wp_get_post_terms($post->ID,'product_tag',array('fields'=>'ids'));
        if (isset($settings['enquiry_exclusion_tag_list'])) {
            foreach ($settings['enquiry_exclusion_tag_list'] as $user_list_key) {
                if ($user_list_key['key'] == $tag_term_list[0]) {
                    $tag_for[] = $post->ID;
                }
            }
        }

        if (in_array($post->ID, $product_for) || in_array($post->ID, $category_for) || in_array($post->ID, $tag_for)) {
            remove_action('woocommerce_single_product_summary', [ $this, 'add_form_for_enquiry'], 10);
        } 
        // else {
        //     add_action('woocommerce_single_product_summary', [ $this, 'add_form_for_enquiry'], 10);

        // }
    }

    public function add_form_for_enquiry() {
        global $post, $product;
        $enquiry_button_text = Catalog()->setting->get_setting( 'enquiry_button_label' ) ? Catalog()->setting->get_setting( 'enquiry_button_label' ) : __('Send an enquiry', 'woocommerce-catalog-enquiry');
        $productid = $post->ID;
        $product = wc_get_product($productid);
        $current_user = wp_get_current_user();
        $product_name = get_post_field('post_title', $productid);
        $settings_array = Utill::get_form_settings_array('catalog_enquiry_button_management_settings');
        $form_settings =  Catalog()->setting->get_setting( 'form_customizer' );
        $button_css = $button_href = "";
        $border_size = ( !empty( $settings_array[ 'button_border_size' ] ) ) ? esc_html( $settings_array[ 'button_border_size' ] ).'px' : '1px';
        if ( !empty( $settings_array[ 'button_background_color' ] ) )
            $button_css .= "background:" . esc_html( $settings_array[ 'button_background_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_text_color' ] ) )
            $button_css .= "color:" . esc_html( $settings_array[ 'button_text_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_border_color' ] ) )
            $button_css .= "border: " . $border_size . " solid " . esc_html( $settings_array[ 'button_border_color' ] ) . ";";
        if ( !empty( $settings_array[ 'button_font_size' ] ) )
            $button_css .= "font-size:" . esc_html( $settings_array[ 'button_font_size' ] ) . "px;";
        if ( !empty( $settings_array[ 'button_border_radious' ] ) )
            $button_css .= "border-radius:" . esc_html( $settings_array[ 'button_border_radious' ] ) . "px;";

        $settings_array[ 'button_text' ] = __('Send an enquiry', 'woocommerce-catalog-enquiry');
        ?>
        <div id="woocommerce-catalog" name="woocommerce_catalog" >
        <?php 
            if (Catalog()->setting->get_setting( 'is_enable_out_of_stock' ) ){
                if ( !$product->managing_stock() && !$product->is_in_stock()) { ?>
                <br/>
                <button class="woocommerce-catalog-enquiry-btn button demo btn btn-primary btn-large" style="<?php echo $button_css; ?>" href="#responsive"><?php echo esc_html( $settings_array[ 'button_text' ] ); ?></button>
                <?php
                } 
            } else { ?>
                <br/>
                <button class="woocommerce-catalog-enquiry-btn button demo btn btn-primary btn-large" style="<?php echo $button_css; ?>" href="#responsive"><?php echo esc_html( $settings_array[ 'button_text' ] ); ?></button>
                <?php
            }
             ?>
            <input type="hidden" name="product_name_for_enquiry" id="product-name-for-enquiry" value="<?php echo get_post_field('post_title', $post->ID); ?>" />
            <input type="hidden" name="product_url_for_enquiry" id="product-url-for-enquiry" value="<?php echo get_permalink($post->ID); ?>" />
            <input type="hidden" name="product_id_for_enquiry" id="product-id-for-enquiry" value="<?php echo $post->ID; ?>" />
            <input type="hidden" name="enquiry_product_type" id="enquiry-product-type" value="<?php
                if ($product->is_type('variable')) {
                    echo 'variable';
                }
                ?>" />
            <div id="responsive"  class="catalog-modal <?php echo Catalog()->setting->get_setting( 'is_disable_popup' ) ? 'popup_disable' : 'popup_enable' ?>">
            <form id="catalog-enquiry-form" role="form" method="post" enctype="multipart/form-data">
			    <input type="hidden" name="product_id_for_enquiry" id="product-id-for-enquiry" value="<?php echo $post->ID; ?>" />
			    <input type="hidden" name="user_id_for_enquiry" id="user-id-for-enquiry" value="<?php echo $current_user->ID; ?>" />
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close">&times;</button>
                            <h2><?php echo __('Enquiry about ', 'woocommerce-catalog-enquiry') ?> <?php echo $product_name; ?></h2>
                            
                    </div>
                    <div class="modal-body">  
                        <p id="msg-for-enquiry-error"></p>
                        <p id="msg-for-enquiry-sucesss"></p>
                        <!-- <p id="loader-after-sumitting-the-form"><img src="<?php echo Catalog()->plugin_url; ?>assets/images/loader.gif" ></p> -->

                        <div class="cat-form-row">
                            <?php 
                            foreach ($form_settings as $field) {
                                if ($field['active']) {
                                    $label = !empty($field['label']) ? $field['label'] : $this->getDefaultLabel()[$field['key']];
                                    $inputType = $this->getInputType($field['key']);
                                    echo "<label for='{$field['key']}'>$label</label><br>";
                                    if ($field['key'] == 'name') {
                                        echo "<input type='text' name='{$field['key']}' id='{$field['key']}' value= '$current_user->display_name'><br>";
                                    } elseif ($field['key'] == 'email') {
                                        echo "<input type='email' name='{$field['key']}' id='{$field['key']}' value='$current_user->user_email'><br>";
                                    }
                                    elseif ($inputType === 'file') {
                                        echo "<input type='$inputType' name='{$field['key']}' id='{$field['key']}' accept='image/*'><br>";
                                    } else {
                                        echo "<input type='$inputType' name='{$field['key']}' id='{$field['key']}'><br>";
                                    }
                                }
                            }
                            ?>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default"><?php echo __('Close', 'woocommerce-catalog-enquiry'); ?></button>
                        <input type="submit" id="woocommerce-submit-enquiry" class="btn btn-primary" value="<?php echo __('Send', 'woocommerce-catalog-enquiry');?>"/>
                    </div>
                </div>
            </form>
            </div>			
        </div>		
        <?php
        
    }

    // Function to get default labels for each field
    function getDefaultLabel() {
        $defaultLabels = array(
            'name' => 'Enter your name',
            'email' => 'Enter your Email Id',
            'phone' => 'Enter your Phone Number',
            'address' => 'Enter your Address',
            'subject' => 'Enter your Subject Label',
            'fileupload' => 'Upload a file',
            'comment' => 'Enter your message',
            'filesize-limit' => 'Filesize Limit',
            'captcha' => 'Captcha',
        );
        return $defaultLabels;
    }

    // Function to get input type for each field
    function getInputType($key) {
        switch ($key) {
            case 'email':
                return 'email';
            case 'phone':
                return 'tel';
            case 'fileupload':
                return 'file';
            default:
                return 'text';
        }
    }

    function save_enquiry_send_mail() {
        global $wpdb;
        if (!empty($_POST['formData'])) {
            foreach ($_POST['formData'] as $value) {
                if ($value['name'] == 'product_id_for_enquiry') {
                    $product_id = $value['value'];
                } elseif ($value['name'] == 'user_id_for_enquiry') {
                    $user_id = $value['value'];
                } elseif ($value['name'] == 'name') {
                    $customer_name = $value['value'];
                } elseif ($value['name'] == 'email') {
                    $customer_email = $value['value'];
                } else {
                    $other_fields[] =   $value;
                }
            }
        }
        $product_quantity[$product_id] = $_POST['quantity'];
        // Prepare data for insertion
        $data = array(
            'product_id' => $product_id,
            'product_quantity' => serialize($product_quantity),
            'user_id' => $user_id,
            'user_name' => $customer_name, 
            'user_email' => $customer_email, 
            'user_additional_fields' => serialize($other_fields),
        );

        $result = $wpdb->insert($wpdb->prefix . 'catalog_enquiry_table', $data);
        if ($result) {
            $enquiry_id = $wpdb->insert_id;
            $admin_email  = get_option('admin_email');
            $User_details = get_user_by('email', $admin_email);
            $to_user_id   = $User_details->data->ID;
        
            $chat_message = '';
            foreach($other_fields as $key => $field){ 
                if ($field['type'] != 'file'){
                    $chat_message.= '<strong>'.$field['name'].':</strong><br>'.$field['value'].'<br>';
                }
            }
            $wpdb->query("insert into {$wpdb->prefix}catelog_cust_vendor_answers set to_user_id='{$to_user_id}', from_user_id = '{$user_id}',chat_message='{$chat_message}',product_id='{$product_id}',enquiry_id='{$enquiry_id}',status='unread' ");
        }

    }
}
?>