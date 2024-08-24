import { __ } from '@wordpress/i18n';

export default {
    id: 'wholesale_registration',
    priority: 70,
    name: __("Custom Wholesale Form Builder", "woocommerce-catalog-enquiry"),
    desc: __("Drag-and-drop interface to tailor the wholesale registration form.", "woocommerce-catalog-enquiry"),
    icon: 'font-settings',
    submitUrl: 'save_enquiry',
    modal : [
        // {
        //     key: 'registration_form_builder',
        //     type: 'checkbox',
        //     label: __( "Custom registration form", 'woocommerce-catalog-enquiry' ),
        //     desc: __( 'Create and customize a separate page for wholesale user registration, allowing admins to select and configure specific fields for a tailored registration process.', 'woocommerce-catalog-enquiry' ),
        //     options: [
        //         {
        //             key: "registration_form_builder",
        //             label: __('', 'woocommerce-catalog-enquiry'),
        //             value: "registration_form_builder"
        //         }
        //     ],
        // },
        {
            key: 'wholesale_from_settings',
            type: 'from_builder',
            classes: 'catalog-customizer-wrapper',
            // proSetting: true,
        }
    ]
}