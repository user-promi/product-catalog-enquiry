import { __ } from '@wordpress/i18n';

export default {
    id: 'tools',
    priority: 50,
    name: __("Tools", "woocommerce-catalog-enquiry"),
    desc: __("Review all system logs and errors", "woocommerce-catalog-enquiry"),
    icon: 'font-settings',
    submitUrl: 'save_enquiry',
    modal : [
        {
            key: "custom_css_product_page",
            type: "textarea",
            desc: __("Put your custom css here, to customize the enquiry form.", "woocommerce-catalog-enquiry"),
            label: __("Addional CSS", "woocommerce-catalog-enquiry"),
        },
        // {
        //     key: 'is_page_redirect',
        //     type: 'checkbox',
        //     label: __( "Redirect after Enquiry form Submission", 'woocommerce-catalog-enquiry' ),
        //     options: [
        //         {
        //             key: "is_page_redirect",
        //             label: __('Enable this to redirect user to another page after successful enquiry submission.', 'woocommerce-catalog-enquiry'),
        //             value: "is_page_redirect"
        //         }
        //     ]
        // },
        {
            key: 'redirect_page_id',
            dependent: {
                key: "is_page_redirect",
                set: true
            },
            type: 'select',
            label:  __( 'Set Redirect Page', 'woocommerce-catalog-enquiry' ),
            desc: __( 'Select page where user will be redirected after successful enquiry.', 'woocommerce-catalog-enquiry' ),
            options: appLocalizer.pages_array,
        },
        {
            key: 'set_enquiry_cart_page',
            type: 'select',
            label: __("Set Enquiry Cart Page", "woocommerce-catalog-enquiry"),
            desc: __("Select the enquiry cart page", "woocommerce-catalog-enquiry"),
            options: appLocalizer.pages_array,
            proSetting: true,
        },
        {
            key: 'set_request_quote_page',
            type: 'select',
            label: __("Set Request Quote Page", "woocommerce-catalog-enquiry"),
            desc: __("Select the request quote page", "woocommerce-catalog-enquiry"),
            options: appLocalizer.pages_array,
            proSetting: true,
        },
    ]
}