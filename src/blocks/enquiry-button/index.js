import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import axios from 'axios';

registerBlockType('woocommerce-catalog-enquiry/enquiry-button', {
    title: 'Enquiry Button',
    icon: 'button',
    category: 'widgets',
    supports: {
        html: true,
    },
    attributes: {
        productId: {
            type: 'number',
            default: null,
        },
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps();
        const [contentHtml, setContentHtml] = useState(__('Loading ...', 'woocommerce-catalog-enquiry'));

        // Select the product ID from the WooCommerce Single Product Block
        const productId = useSelect((select) => {
            const blocks = select('core/block-editor').getBlocks();
            const singleProductBlock = blocks.find(
                (block) => block.name === 'woocommerce/single-product'
            );
            return singleProductBlock?.attributes?.productId || null;
        }, []);

        // Update the product ID attribute if it changes
        useEffect(() => {
            if (productId && productId !== attributes.productId) {
                setAttributes({ productId });
            }
        }, [productId]);

        // Fetch the rendered form from the REST API
        useEffect(() => {
            if (productId) {
                axios.get(`${enquiryButton.apiUrl}/${enquiryButton.restUrl}/render-enquiry-button?product_id=${productId}`)
                    .then((response) => {
                        setContentHtml(response.data.html || __('Failed to load.', 'woocommerce-catalog-enquiry'));
                    });
            } else {
                setContentHtml(__('No product selected.', 'woocommerce-catalog-enquiry'));
            }
        }, [productId]);

        return (
            <div {...blockProps}>
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
        );
    },

    save: () => {
        // Save function remains empty since rendering is handled by the PHP render callback
        return null;
    },
});

