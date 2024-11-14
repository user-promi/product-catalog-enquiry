import { __ } from '@wordpress/i18n';

export default {
    id: 'tools',
    priority: 90,
    name: __("Tools", "woocommerce-catalog-enquiry"),
    desc: __("Review all system logs and errors", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-paint-brush',
    submitUrl: 'save_enquiry',
    modal : [
        {
            key: "custom_css_product_page",
            type: "textarea",
            desc: __("Put your custom css here, to customize the inquiry form.", "woocommerce-catalog-enquiry"),
            label: __("Addional CSS", "woocommerce-catalog-enquiry"),
        },    
    ]
}