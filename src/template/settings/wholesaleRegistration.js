import { __ } from '@wordpress/i18n';

export default {
    id: 'wholesale_registration',
    priority: 70,
    name: __("Custom Wholesale Form Builder", "woocommerce-catalog-enquiry"),
    desc: __("Drag-and-drop interface to tailor the wholesale registration form.", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-settings',
    submitUrl: 'save_enquiry',
    modal : [
        {
            key: 'wholesale_from_settings',
            type: 'from-builder',
            classes: 'catalog-customizer-wrapper',
            proSetting: true,
        }
    ]
}