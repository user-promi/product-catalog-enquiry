import { __ } from '@wordpress/i18n';
export default {
    id: 'all_settings',
    priority: 20,
    name: __("Shopping Journey", "woocommerce-catalog-enquiry"),
    desc: __("Set up sales flow and catalog mode with integrated enquiry and quotation management.", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-settings',
    submitUrl: 'save_enquiry',
    modal: [
        {
            key: 'is_hide_cart_checkout',
            type: 'checkbox',
            label: __( "Turn off sitewide buying", 'woocommerce-catalog-enquiry' ),
             desc: __('Redirect users to the homepage when they click on the cart or checkout page. To customize the redirection to a different page, an upgrade to Pro <a href="https://multivendorx.com/woocommerce-request-a-quote-product-catalog/" target="_blank">WooCommerce Catalog Enquiry Pro</a>.', 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "is_hide_cart_checkout",
                    value: "is_hide_cart_checkout"
                }
            ],
            proSetting: true,
        },
        {
            key: 'disable_cart_page_link',
            type: 'select',
            label:  __( 'Cart/Checkout Redirect Page', 'woocommerce-catalog-enquiry' ),
            // desc: apply_filters('woocommerce_catalog_redirect_disabled_cart_page', __( 'Select page where user will be redirected for disable cart page. To use this feature kindly upgrade to <a href="https://multivendorx.com/woocommerce-request-a-quote-product-catalog/" target="_blank">WooCommerce Catalog Enquiry Pro</a>.', 'woocommerce-catalog-enquiry' )),
            options: [
                {
                    value:'',
                    label: 'Home',
                    key : '',
                },
                ...appLocalizer.all_pages
            ],
            dependent: {
                key: "is_hide_cart_checkout",
                set: true
            },
            proSetting: true,
        },
        {
            key: 'separator_content',
            type: 'section',
            desc: __("Enquiry", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'enquiry_user_permission',
            type: 'checkbox',
            label: __( "Restrict product enquiries for logged-in users only", 'woocommerce-catalog-enquiry' ),
            desc: __( "If enabled, non-logged-in users can't access the enquiry flow.", 'woocommerce-catalog-enquiry' ),
            options: [
                {
                    key: "enquiry_logged_out",
                    value: "enquiry_logged_out"
                }
            ],
        },
        {
            key: 'is_enable_out_of_stock',
            type: 'checkbox',
            label: __( "Enquiry for out-of-stock products only", 'woocommerce-catalog-enquiry' ),
            desc: __("Enquiry button is shown exclusively for products that are out of stock. For items that are in stock, the Add-to-Cart button will be displayed instead.", 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "is_enable_out_of_stock",
                    value: "is_enable_out_of_stock"
                }
            ]
        },
        {
            key: 'notify_me_button',
            type: 'stock-alert-checkbox',
            dependent: {
                key: "is_enable_out_of_stock",
                set: true
            },
            label: __("In-Stock notify me button ", "woocommerce-catalog-enquiry"),
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
            key: 'is_disable_popup',
            type: 'settingToggle',
            label: __( "Display enquiry form as", 'woocommerce-catalog-enquiry' ),
            desc: __("Select whether the form is displayed directly on the page or in a pop-up window.", 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "popup",
                    value: "popup",
                    label: "Popup",
                },
                {
                    key: "inline",
                    value: "inline",
                    label: "Inline In-page",
                }
            ]
        },
        {
            key: 'is_page_redirect',
            type: 'checkbox',
            label: __( "Redirect after enquiry form Submission", 'woocommerce-catalog-enquiry' ),
            desc: __("Enable this to redirect user to another page after successful enquiry submission.", 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "is_page_redirect",
                    value: "is_page_redirect"
                }
            ]
        },
        {
            key: 'redirect_page_id',
            dependent: {
                key: "is_page_redirect",
                set: true
            },
            type: 'select',
            label:  __( 'Post enquiry submission redirect page', 'woocommerce-catalog-enquiry' ),
            desc: __( 'Select page where user will be redirected after successful enquiry.', 'woocommerce-catalog-enquiry' ),
            options: appLocalizer.all_pages,
        },
        {
            key: 'is_enable_multiple_product_enquiry',
            type: 'checkbox',
            label: __( "Multi-product enquiry", 'woocommerce-catalog-enquiry' ),
            desc: __("Enable multiple enquiry flow so customers can add several products to their enquiry cart and submit a single enquiry for all selected items.", 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "is_enable_multiple_product_enquiry",
                    value: "is_enable_multiple_product_enquiry"
                }
            ],
            proSetting: true,
        },
        {
            key: 'separator_content',
            type: 'section',
            desc: __("Quotation", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'quote_user_permission',
            type: 'checkbox',
            label: __( "Limit quotation requests to logged-in users only.", 'woocommerce-catalog-enquiry' ),
            desc: __("If enabled, non-logged-in users cannot submit quotation requests.", 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "logged_out",
                    value: "logged_out"
                }
            ],
        },
        {
            key: 'set_expiry_time',
            type: 'text',
            label:  __( 'Quotation expiry duration', 'woocommerce-catalog-enquiry' ),
            desc: __( 'Set the period after which a quotation will expire and no longer be valid for purchase.', 'woocommerce-catalog-enquiry' ),
            parameter: __('days', 'woocommerce-catalog-enquiry'),
            proSetting: true,
        },
        {
            key: 'separator_content',
            type: 'section',
            desc: __("PDF Manager", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'display_pdf',
            type: 'multi-checkbox-table',
            label: __("Attachment", "woocommerce-catalog-enquiry"),
            classes: 'gridTable',
            rows: [
                {
                    key: "allow_download_pdf",
                    label: __('Download as PDF', 'woocommerce-catalog-enquiry'),
                },
                {
                    key: "attach_pdf_to_email",
                    label: __('Attach with Email', 'woocommerce-catalog-enquiry'),
                }
            ],
            columns: [
                {
                    key: "enquiry_pdf_permission",
                    label: __("Enquiry", "woocommerce-catalog-enquiry")
                },
                {
                    key: "quote_pdf_permission",
                    label: __("Quote", "woocommerce-catalog-enquiry")
                }
            ],
            proSetting: true,
        },
    ]
};