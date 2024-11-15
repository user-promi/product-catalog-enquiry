import { __ } from '@wordpress/i18n';

export default {
    id: 'wholesale',
    priority: 60,
    name: __("Wholesale", "woocommerce-catalog-enquiry"),
    desc: __("Wholesale sign up and registration management.", "woocommerce-catalog-enquiry"),
    icon: 'adminLib-warehousing-icon',
    submitUrl: 'save_enquiry',
    modal : [
        {
            key: "approve_wholesaler",
            type: "settingToggle",
            label: __("Approval of wholesale users through registration form", "woocommerce-catalog-enquiry"),
            desc: __('Not Required - Disable wholesale registration form. User will be assigned as wholeseller role from backend. <br>Manual - Admin approves new wholesalers manually from "Wholeseller Users" page. <br>  Automatic - Instant wholesaler approval upon sign-up', 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "off",
                    label: __('Not required', 'woocommerce-catalog-enquiry'),
                    value: "off"
                },
                {
                    key: "manual",
                    label: __('Manual', 'woocommerce-catalog-enquiry'),
                    value: "manual"
                },
                {
                    key: "automatic",
                    label: __('Automatic', 'woocommerce-catalog-enquiry'),
                    value: "Automatic"
                }
            ],
            proSetting: true,
        },
        {
            key: "disable_coupon_for_wholesale",
            type: "checkbox",
            label: __("Coupon restriction for wholesalers", "woocommerce-catalog-enquiry"),
            desc: __('Prevent wholesale users from applying any coupon and get addional discount on their orders.', 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "disable_coupon_for_wholesale",
                    label: __('', 'woocommerce-catalog-enquiry'),
                    value: "disable_coupon_for_wholesale"
                }
            ],
            proSetting: true,
        },
        {
            key: "show_wholesale_price",
            type: "checkbox",
            label: __("Promote wholesale discounts to non-wholesale users", "woocommerce-catalog-enquiry"),
             desc: __('Display discounted prices on product pages to entice regular customers into becoming wholesalers.', 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "show_wholesale_price",
                    label: __('', 'woocommerce-catalog-enquiry'),
                    value: "show_wholesale_price"
                }
            ],
            proSetting: true,
        },
        {
            key: "enable_order_form",
            type: "checkbox",
            label: __("Dedicated wholesale-only product list", "woocommerce-catalog-enquiry"),
            desc: __('Enables a dedicated wholesale-only page displaying all wholesale products for easy browsing and single-click checkout by logged-in wholesalers.', 'woocommerce-catalog-enquiry'),
            options: [
                {
                    key: "enable_order_form",
                    label: __('', 'woocommerce-catalog-enquiry'),
                    value: "enable_order_form"
                }
            ],
            proSetting: true,
        },
        {
            key: "wholesale_discount",
            type: "mergeComponent",
            label: __("Discount rule", "woocommerce-catalog-enquiry"),
            desc: __('<b>Bulk Discount Configuration: </b> Set discount type (percentage/fixed), discount amount, and minimum quantity for wholesellers', 'woocommerce-catalog-enquiry'),
            proSetting: true,
            fields: [
                {
                    name: 'wholesale_discount_type',
                    type: 'select',
                    options: [
                        { 
                            value: 'fixed_amount', 
                            label: 'Fixed Amount' 
                        },
                        { 
                            value: 'percentage_amount', 
                            label: 'Percentage Amount' 
                        }
                    ]
                },
                {
                    name: 'wholesale_amount',
                    type: 'number',
                    placeholder: 'Discount value'
                },
                {
                    name: 'minimum_quantity',
                    type: 'number',
                    placeholder: 'Minimum quantity'
                }
            ],
        },

        // {
        //     key: "wholesale_discount_type",
        //     type: "select",
        //     label: __("Discount type", "woocommerce-catalog-enquiry"),
        //     desc: __('Specify the exact amount or percentage to be deducted from the total order value, ', 'woocommerce-catalog-enquiry'),
        //     options: [
        //         {
        //             key: "fixed_amount",
        //             label: __('Fixed Amount', 'woocommerce-catalog-enquiry'),
        //             value: "fixed_amount"
        //         },
        //         {
        //             key: "percentage_amount",
        //             label: __('Percentage Amount', 'woocommerce-catalog-enquiry'),
        //             value: "percentage_amount"
        //         }
        //     ],
        // },
        // {
        //     key: "wholesale_amount",
        //     type: "number",
        //     label: __("Discount value", "woocommerce-catalog-enquiry"),
        //     desc: __('Specify the exact amount or percentage to be deducted from the total order value, ', 'woocommerce-catalog-enquiry'),
        // },
        // {
        //     key: "minimum_quantity",
        //     type: "number",
        //     label: __("Minimum quantity", "woocommerce-catalog-enquiry"),
        //     desc: __('Set the minimum quantity of items required to qualify for the discount.', 'woocommerce-catalog-enquiry'),
        // },
    ]
}