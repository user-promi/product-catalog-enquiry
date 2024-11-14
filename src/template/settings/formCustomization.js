import { __ } from '@wordpress/i18n';

export default {
    id: 'enquiry_form_customization',
    priority: 30,
    name: __("Enquiry Form Builder", "woocommerce-catalog-enquiry"),
    desc: __("Design a personalized enquiry form with built-in form builder. ", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-contact-form-svgrepo-com',
    submitUrl: 'save_enquiry',
    modal: [
        {
            key: 'form_customizer',
            type: 'form-customizer',
            desc: __("Form Customizer", "woocommerce-catalog-enquiry"),
            classes: 'form_customizer',
            proSetting: true
        }
    ]
};
