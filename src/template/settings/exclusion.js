import { __ } from '@wordpress/i18n';

export default {
    id: 'enquiry_quote_exclusion',
    priority: 40,
    name: __("Exclusion", "woocommerce-catalog-enquiry"),
    desc: __("Exclude catalog viewing, inquiries, and quotes by user roles and product attributes.", "woocommerce-catalog-enquiry"),
    icon: 'font-settings',
    submitUrl: 'save_enquiry',
    modal: [
        // {
        //     key: "woocommerce_userroles_list",
        //     type: "multi-select",
        //     label: __("User Role Specific Exclusion", "woocommerce-catalog-enquiry"),
        //     desc: __("Select the user roles, who won’t be able to send enquiry.", "woocommerce-catalog-enquiry"),
        //     options: appLocalizer.role_array
        // },
        // {
        //     key: "woocommerce_user_list",
        //     type: "multi-select",
        //     label: __("User Name Specific Exclusion", "woocommerce-catalog-enquiry"),
        //     desc: __("Select the users, who won’t be able to send enquiry.", "woocommerce-catalog-enquiry"),
        //     options: appLocalizer.all_users
        // },
        // {
        //     key: "woocommerce_product_list",
        //     type: "multi-select",
        //     label: __("Product Specific Exclusion", "woocommerce-catalog-enquiry"),
        //     desc: __("Select the products that should have the Add to cart button, instead of enquiry button.", "woocommerce-catalog-enquiry"),
        //     options: appLocalizer.all_products
        // },  
        // {
        //     key: "woocommerce_category_list",
        //     type: "multi-select",
        //     label: __("Category Specific Exclusion", "woocommerce-catalog-enquiry"),
        //     desc: __("Select the Category, where should have the Add to cart button, instead of enquiry button.", "woocommerce-catalog-enquiry"),
        //     options: appLocalizer.all_product_cat
        // },
        // {
        //     key: "woocommerce_tag_list",
        //     type: "multi-select",
        //     label: __("Tag Specific Exclusion", "woocommerce-catalog-enquiry"),
        //     desc: __("Select the Tag, where should have the Add to cart button, instead of enquiry button.", "woocommerce-catalog-enquiry"),
        //     options: appLocalizer.all_product_cat
        // },
        {
            key: 'grid_table',
            type: 'grid_table',
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
