// import { registerBlockType } from '@wordpress/blocks';
// import { useBlockProps } from '@wordpress/block-editor';
// import { useState, useEffect } from '@wordpress/element';
// import { RawHTML } from '@wordpress/element';
// import axios from 'axios';

// registerBlockType('woocommerce-catalog-enquiry/enquiry-button', {
//     title: 'Enquiry Button',
//     icon: 'button',
//     category: 'widgets',
// 	supports: {
// 		html: true,
// 	},
// 	edit() {
// 		const blockProps = useBlockProps();
//         const [shortcodeContent, setShortcodeContent] = useState('');

//         useEffect(() => {
//             axios({
//                 method: "post",
//                 url: `${appLocalizer.apiurl}/catalog/v1/render-enquiry-button`,
//             }).then((response) => {
//                 console.log(response)
//                 setShortcodeContent(response.data);
//             });
//         }, []);

//         return (
//             <div {...blockProps}>
//                 <RawHTML>{shortcodeContent}</RawHTML>
//             </div>
//         );
// 	},
// 	save() {
// 		return (
//             <div></div>
// 		);
// 	},
// });

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { RawHTML } from '@wordpress/element';
import axios from 'axios';

registerBlockType('woocommerce-catalog-enquiry/enquiry-button', {
    title: 'Enquiry Button',
    icon: 'button',
    category: 'widgets',
    supports: {
        html: true,
    },
    attributes: {
        content: {
            type: 'string',
            default: '',
        },
    },
    edit({ attributes, setAttributes }) {
        const blockProps = useBlockProps();
        const [shortcodeContent, setShortcodeContent] = useState(attributes.content);

        useEffect(() => {
            if (!shortcodeContent) {
                axios({
                    method: 'post',
                    url: `${appLocalizer.apiurl}/catalog/v1/render-enquiry-button`,
                }).then((response) => {
                    setShortcodeContent(response.data);
                    setAttributes({ content: response.data });
                });
            }
        }, [shortcodeContent, setAttributes]);

        return (
            <div {...blockProps}>
                <RawHTML>{shortcodeContent}</RawHTML>
            </div>
        );
    },
    save({ attributes }) {
        // Render the saved content on the front end
        return (
            <div>
                <RawHTML>{attributes.content}</RawHTML>
            </div>
        );
    },
});

