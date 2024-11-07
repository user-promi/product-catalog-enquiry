import { __ } from '@wordpress/i18n';

export default {
    id: 'enquiry_form_customization',
    priority: 30,
    name: __("Enquiry Form Builder", "woocommerce-catalog-enquiry"),
    desc: __("Design a personalized enquiry form with built-in form builder. ", "woocommerce-catalog-enquiry"),
    icon: 'font-settings',
    submitUrl: 'save_enquiry',
    modal: [
        // {
        //     key: 'catalog_customizer',
        //     type: 'catalog_customizer',
        //     label: __("Catalog Customizer", "woocommerce-catalog-enquiry"),
        //     desc: __("Catalog Customizer", "woocommerce-catalog-enquiry"),
        // },
        {
            key: 'form_customizer',
            type: 'form-customizer',
            desc: __("Form Customizer", "woocommerce-catalog-enquiry"),
            classes: 'form_customizer',
            proSetting: true
        }
    ]
};
