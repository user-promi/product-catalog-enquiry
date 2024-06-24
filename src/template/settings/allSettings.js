import { __ } from '@wordpress/i18n';

export default {
    id: 'all_settings',
    priority: 20,
    name: __("Quotation & Product Catalog Controller", "woocommerce-catalog-enquiry"),
    desc: __("Setup Catalog mode with integrated enquiry and quote management.", "woocommerce-catalog-enquiry"),
    icon: 'font-settings',
    submitUrl: 'save_enquiry',
    modal: [
        {
            key: 'separator_content',
            type: 'section',
            desc: __("Catalog", "woocommerce-catalog-enquiry"),
            //hint: __("Modify settings to control user access, catalog design.", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'is_hide_cart_checkout',
            type: 'checkbox',
            label: __( "Deactivate cart and checkout page?", 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "is_hide_cart_checkout",
                    label: __('Enable this option to redirect users to the homepage when they click on the cart or checkout page. To customize the redirection to a different page, consider upgrading to the Pro <a href="https://multivendorx.com/woocommerce-request-a-quote-product-catalog/" target="_blank">WooCommerce Catalog Enquiry Pro</a>.', 'woocommerce-catalog-enquiry'),
                    value: "is_hide_cart_checkout"
                }
            ]
        },
        {
            key: 'disable_cart_page_link',
            type: 'select',
            label:  __( 'Set redirect page', 'woocommerce-catalog-enquiry' ),
            // desc: apply_filters('woocommerce_catalog_redirect_disabled_cart_page', __( 'Select page where user will be redirected for disable cart page. To use this feature kindly upgrade to <a href="https://multivendorx.com/woocommerce-request-a-quote-product-catalog/" target="_blank">WooCommerce Catalog Enquiry Pro</a>.', 'woocommerce-catalog-enquiry' )),
            options: appLocalizer.pages_array,
            dependent: {
                key: "is_hide_cart_checkout",
                set: true
            },
            proSetting: true,
        },
        {
            key: 'is_hide_product_price',
            type: 'checkbox',
            label: __( "Hide Product Price", 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "is_hide_product_price",
                    label: __('Enable this option to hide product price', 'woocommerce-catalog-enquiry'),
                    value: "is_hide_product_price"
                }
            ]
        },
        {
            key: 'separator_content',
            type: 'section',
            desc: __("Enquiry", "woocommerce-catalog-enquiry"),
            //hint: __("Enquiry", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'display_enquiry_button_user_type',
            type: 'select',
            label: __("Enquiry viewing preferences", "woocommerce-catalog-enquiry"),
            desc: __("Set visibility options for the inquiry button: all users, logged-in users, or logged-out users. Default setting allows all users to see the button.", "woocommerce-catalog-enquiry"),
            options: [
                {
                    key: "logged_out",
                    label: __('Only Logged out Users', 'woocommerce-catalog-enquiry'),
                    value: "logged_out"
                },
                {
                    key: "logged_in",
                    label: __('Only Logged in Users', 'woocommerce-catalog-enquiry'),
                    value: "logged_in"
                },
                {
                    key: "all_users",
                    label: __('All Users', 'woocommerce-catalog-enquiry'),
                    value: "all_users"
                }
            ]
        },
        {
            key: 'is_enable_add_to_cart',
            type: 'checkbox',
            label:  __( 'Display Add-to-Cart button along with', 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "is_enable_add_to_cart",
                    label: __('Activate to display both the "Add to Cart" and "Enquiry" buttons across the entire shop.', 'woocommerce-catalog-enquiry'),
                    value: "is_enable_add_to_cart"
                }
            ],
            proSetting: true,
        },
        {
            key: 'is_enable_out_of_stock',
            type: 'checkbox',
            label: __( "Enquiry for Out-of-Stock products only", 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "is_enable_out_of_stock",
                    label: __("Display Enquiry Button for Out-of-Stock Products Only. For in-stock items, Add-to-Cart button will be displayed.", 'woocommerce-catalog-enquiry'),
                    value: "is_enable_out_of_stock"
                }
            ]
        },
        {
            key: 'notify_me_button',
            type: 'checkbox',
            dependent: {
                key: "is_enable_out_of_stock",
                set: true
            },
            label: __("In-Stock Notify Me button ", "woocommerce-catalog-enquiry"),
            desc: __("This option allows customers to subscribe for automatic stock notifications.", "woocommerce-catalog-enquiry"),
            options: [
                {
                    key: "notify_me_button",
                    label: __("", 'woocommerce-catalog-enquiry'),
                    value: "notify_me_button"
                }
            ]
        },
        {
            key: 'separator_content',
            type: 'section',
            desc: __("Quote", "woocommerce-catalog-enquiry"),
            //hint: __("Quote", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'display_quote_button_user_type',
            type: 'select',
            label: __("Quotation button accessibility", "woocommerce-catalog-enquiry"),
            desc: __("Select the type users where this enquiry button is applicable", "woocommerce-catalog-enquiry"),
            options: [
                {
                    key: "logged_out",
                    label: __('Only Logged out Users', 'woocommerce-catalog-enquiry'),
                    value: "logged_out"
                },
                {
                    key: "logged_in",
                    label: __('Only Logged in Users', 'woocommerce-catalog-enquiry'),
                    value: "logged_in"
                },
                {
                    key: "all_users",
                    label: __('All Users', 'woocommerce-catalog-enquiry'),
                    value: "all_users"
                }
            ]
        },
        {
            key: 'is_expiry_time_for_quote',
            type: 'checkbox',
            label: __( "Set an expiry time for quotes", 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "is_expiry_time_for_quote",
                    label: __('', 'woocommerce-catalog-enquiry'),
                    value: "is_expiry_time_for_quote"
                }
            ],
            proSetting: true,
        },
        {
            key: 'set_expiry_time',
            type: 'number',
            label:  __( 'Quote Validity Timer', 'woocommerce-catalog-enquiry' ),
            desc: __( 'Enable to set an expiration time for all quotes sent. Select the number of days after which quotes will expire.', 'woocommerce-catalog-enquiry' ),
            dependent: {
                key: "is_expiry_time_for_quote",
                set: true
            },
            proSetting: true,
        },
        {
            key: 'allow_download_pdf',
            type: 'checkbox',
            label: __( "Allow quotes to be downloaded as PDF", 'woocommerce-catalog-enquiry' ),
            desc: __( "If enabled, users can download their quote as a PDF from 'My Account'", 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "allow_download_pdf",
                    label: __("", 'woocommerce-catalog-enquiry'),
                    value: "allow_download_pdf"
                }
            ],
            proSetting: true,
        },
        {
            key: 'attach_pdf_to_email',
            type: 'checkbox',
            label:  __( 'Attach a PDF version to the quote email', 'woocommerce-catalog-enquiry' ),
            desc: __( 'If enabled, users can download a PDF version of the quotes.', 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "attach_pdf_to_email",
                    label: __('', 'woocommerce-catalog-enquiry'),
                    value: "attach_pdf_to_email"
                }
            ],
            proSetting: true,
        }
    ]
};
