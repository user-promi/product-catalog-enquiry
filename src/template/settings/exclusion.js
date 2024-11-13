import { __ } from '@wordpress/i18n';

export default {
    id: 'enquiry_quote_exclusion',
    priority: 40,
    name: __("Exclusion", "woocommerce-catalog-enquiry"),
    desc: __("Exclude catalog viewing, inquiries, and quotes by user roles and product attributes.", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-settings',
    submitUrl: 'save_enquiry',
    modal: [
        {
            key: 'exclusion',
            type: 'multi-checkbox-table',
            label: __("", "woocommerce-catalog-enquiry"),
            desc: __("Grid Table", "woocommerce-catalog-enquiry"),
            classes: 'gridTable no-label',
            rows: [
                {
                    key: "userroles_list",
                    label: __('User Role', 'woocommerce-catalog-enquiry'),
                    options: appLocalizer.role_array
                },
                {
                    key: "user_list",
                    label: __('User Name', 'woocommerce-catalog-enquiry'),
                    options: appLocalizer.all_users
                },
                {
                    key: "product_list",
                    label: __('Product', 'woocommerce-catalog-enquiry'),
                    options: appLocalizer.all_products
                },
                {
                    key: "category_list",
                    label: __('Category', 'woocommerce-catalog-enquiry'),
                    options: appLocalizer.all_product_cat
                },
                {
                    key: "tag_list",
                    label: __('Tag', 'woocommerce-catalog-enquiry'),
                    options: appLocalizer.all_product_tag
                }
            ],
            columns: [
                {
                    key: "catalog_exclusion",
                    label: __("Catalog", "woocommerce-catalog-enquiry")
                },
                {
                    key: "enquiry_exclusion",
                    label: __("Enquiry", "woocommerce-catalog-enquiry")
                },
                {
                    key: "quote_exclusion",
                    label: __("Quote", "woocommerce-catalog-enquiry")
                }
            ],
        }
    ]
};
