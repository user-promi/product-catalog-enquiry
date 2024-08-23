// import { registerBlockType } from '@wordpress/blocks';
// import { useBlockProps } from '@wordpress/block-editor';
// import { useState, useEffect } from '@wordpress/element';
// import { RawHTML } from '@wordpress/element';
// import axios from 'axios';

// registerBlockType('woocommerce-catalog-enquiry/quote-button', {
//     title: 'Quote Button',
//     icon: 'button',
//     category: 'widgets',
// 	supports: {
// 		html: true,
// 	},
//     attributes: {
//         content: {
//             type: 'string',
//             default: '',
//         },
//     },
//     edit({ attributes, setAttributes }) {
//         const blockProps = useBlockProps();
//         const [shortcodeContent, setShortcodeContent] = useState(attributes.content);

//         useEffect(() => {
//             if (!shortcodeContent) {
//                 axios({
//                     method: 'post',
//                     url: `${appLocalizer.apiurl}/catalog/v1/render-quote-button`,
//                 }).then((response) => {
//                     setShortcodeContent(response.data);
//                     setAttributes({ content: response.data });
//                 });
//             }
//         }, [shortcodeContent, setAttributes]);

//         return (
//             <div {...blockProps}>
//                 <RawHTML>{shortcodeContent}</RawHTML>
//             </div>
//         );
//     },
// 	save({ attributes }) {
//         // Render the saved content on the front end
//         return (
//             <div>
//                 <RawHTML>{attributes.content}</RawHTML>
//             </div>
//         );
//     },
// });

// import { registerBlockType } from '@wordpress/blocks';
// import { __ } from '@wordpress/i18n';

// registerBlockType('woocommerce-catalog-enquiry/quote-button', {
//     title: __('Quote Button', 'woocommerce-catalog-enquiry'),
//     icon: 'button',
//     category: 'widgets',
//     edit: () => <p>{__('Catalog Quote Button (Visible only on single product pages)', 'woocommerce-catalog-enquiry')}</p>,
//     save: () => <div></div>, // Save is handled by PHP
// });


import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

registerBlockType('woocommerce-catalog-enquiry/quote-button', {
    title: 'Quote Button',
    icon: 'button',
    category: 'widgets',
    edit() {
        const blockProps = useBlockProps();
        return (
            <div {...blockProps} >
                {AddToQuote()}
            </div>
        );
    },
    save() {
        return (
            <button className="add-request-quote-button">
                Add to Quote
            </button>
        );
    },
});

const AddToQuote = () => {
    useEffect(() => {
        console.log('hiiiii');
        document.addEventListener('click', function(event) {
            if (event.target.closest('.add-request-quote-button')) {
                handleClick(event);
            }
        });
        
        function handleClick(event) {
            event.preventDefault();
        
            const productElement = document.querySelector('[data-block-name="woocommerce/single-product"]');
            const productId = productElement ? productElement.dataset.productId : null;
            console.log(productId); // Output the product ID
        
            const quantityElement = document.querySelector('.quantity .qty');
            const quantity = quantityElement ? quantityElement.value : 1;
        
            const requestData = new URLSearchParams({
                action: 'quote_added_in_list',
                product_id: productId,
                quantity: quantity,
                quote_action: 'add_item'
            });
        
            fetch(appLocalizer.ajaxurl, {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/x-www-form-urlencoded'
                // },
                body: requestData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Handle the response data as needed
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
       
        return () => {
            document.removeEventListener('click', function(event) {
                if (event.target.closest('.add-request-quote-button')) {
                    handleClick(event);
                }
            });
        }
    }, []);

    return (
        <button className="add-request-quote-button">
            Add to Quote
        </button>
        
    );
}
