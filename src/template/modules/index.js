import { __ } from '@wordpress/i18n';

export default [
    {
        id: 'catalog',
        name: __("Catalog Showcase", "woocommerce-catalog-enquiry"),
        desc: __("Idea for showcasing products by hiding prices, disabling purchases, and restricting cart/checkout access.", "woocommerce-catalog-enquiry"),
        icon: 'adminLib-mail',
        doc_link: '',
        settings_link: appLocalizer.site_url,
        pro_module: true,
    },
    {
        id: 'enquiry',
        name: __("Enquiry & Communication", "woocommerce-catalog-enquiry"),
        desc: __("<span class='highlight'>Free:</span> Add inquiry button for single product email enquiries to admin.<br><br> <span class='highlight'>Pro:</span> Full messaging hub with two-way communication, multi-product ennquiries, and centralized management.", "woocommerce-catalog-enquiry"),
        icon: 'adminLib-mail',
        doc_link: '',
        settings_link: appLocalizer.site_url,
        pro_module: false
    },
    {
        id: 'quote',
        name: __("Quotation", "woocommerce-catalog-enquiry"),
        desc: __("<span class='highlight'>Free:</span> Add quotation button for customers to request product quotes via email.<br><br> <span class='highlight'>Pro:</span> Manage quotations with dedicated list views, generate and monitor quotes from admin panel, offer PDF downloads, and set expiry dates.", "woocommerce-catalog-enquiry"),
        icon: 'adminLib-mail',
        doc_link: '',
        settings_link: appLocalizer.site_url,
        pro_module: false
    },
    {
        id: 'wholesale',
        name: __("Wholesale Pricing", "woocommerce-catalog-enquiry"),
        desc: __("<span class='highlight'>Free:</span> Create a wholesale user role with customizable discounts.<br><br> <span class='highlight'>Pro:</span> Custom wholesale registration forms builder, admin approval, wholesale order lists, and coupon restrictions for wholesale users."),
        icon: 'adminLib-mail',
        doc_link: '',
        settings_link: appLocalizer.site_url,
        pro_module: true
    },
    {
        id: 'rules',
        name: __("Dynamic Pricing Rules", "woocommerce-catalog-enquiry"),
        desc: __("You can set up various rules to modify the prices of different categories and products in bulk, targeting specific customers and user roles."),
        icon: 'adminLib-mail',
        doc_link: '',
        settings_link: appLocalizer.site_url,
        pro_module: true
    },
]