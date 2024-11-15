import { __ } from '@wordpress/i18n';

export default {
    id: 'enquiry_email_temp',
    priority: 50,
    name: __("Enquiry Email ", "woocommerce-catalog-enquiry"),
    desc: __("Select your preffered enquiry details email template", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-mail',
    submitUrl: 'save_enquiry',
    modal: [
        {
            key: 'separator_content',
            type: 'section',
            desc: __("Common Settings", "woocommerce-catalog-enquiry"),
            hint: __("", "woocommerce-catalog-enquiry"),
        },
        {
            key: 'additional_alert_email',
            type: 'textarea',
            class: 'woo-setting-wpeditor-class',
            desc: __("Set the email address to receive notifications when a user submits enquiry of a product. You can add multiple comma-separated emails.<br/> Default: The admin\'s email is set as the receiver. Exclude the admin\'s email from the list to exclude admin from receiving these notifications.", "woocommerce-stock-manager"),
            label: __("Recipient email for new subscriber", "woocommerce-stock-manager"),
        },
        {
            key: "selected_email_tpl",
            type: "radio-select",
            label: "Store Header",
            desc: "Select store banner style",
            options: [
                {
                    key: "template1",
                    label: "Outer Space",
                    color: appLocalizer.template1,
                    value: "template1"
                },
                {
                    key: "template2",
                    label: "Green Lagoon",
                    color: appLocalizer.template2,
                    value: "template2"
                },
                {
                    key: "template3",
                    label: "Old West",
                    color: appLocalizer.template3,
                    value: "template3"
                },
                {
                    key: "template4",
                    label: "Old West",
                    color: appLocalizer.template4,
                    value: "template4"
                },
                {
                    key: "template5",
                    label: "Old West",
                    color: appLocalizer.template5,
                    value: "template5"
                },
                {
                    key: "template6",
                    label: "Old West",
                    color: appLocalizer.template6,
                    value: "template6"
                },
                {
                    key: "template7",
                    label: "Old West",
                    color: appLocalizer.template7,
                    value: "template7"
                }
            ],
        },
        // {
        //     key: "custom_email_subject",
        //     type: "textarea",
        //     desc: "Available tags |USER_NAME|,|USER_EMAIL|,|PRODUCT_NAME|,|PRODUCT_URL|,|PRODUCT_SKU|,|PRODUCT_TYPE| ****All the product related tags are not available for multiple enquiry.",
        //     label: "Custom Email Subject",
        // }
    ]
}