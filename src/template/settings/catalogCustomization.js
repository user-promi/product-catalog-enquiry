import { __ } from '@wordpress/i18n';

export default {
    id: 'enquiry_catalog_customization',
    priority: 10,
    name: __("Product Page Builder", "woocommerce-catalog-enquiry"),
    desc: __("Drag-and-drop to create and customize single product page elements.", "woocommerce-catalog-enquiry"),
    icon: 'font-settings',
    submitUrl: 'save_enquiry',
    modal: [
        {
            key: 'catalog_customizer',
            type: 'catalog-customizer',
            desc: __("Catalog Customizer", "woocommerce-catalog-enquiry"),
            classes: 'catalog-customizer-wrapper',
        }
    ]
};
