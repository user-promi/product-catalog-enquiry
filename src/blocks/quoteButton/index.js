import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

// Register the block
registerBlockType('woocommerce-catalog-enquiry/quote-button', {
    title: 'Quote Button',
    icon: 'button',
    category: 'widgets',
    edit() {
        const blockProps = useBlockProps();
        return (
            <div {...blockProps}>
                <button className="add-request-quote-button">Add to Quote</button>
            </div>
        );
    },
    save() {
        return (
            <div>
                <button className="add-request-quote-button">Add to Quote</button>
                <div className="quote-message-container"></div>
            </div>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    const quoteButton = document.querySelector('.add-request-quote-button');
    if (quoteButton) {
        quoteButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('second')

            const productElement = document.querySelector('[data-block-name="woocommerce/single-product"]');
            const productId = productElement ? productElement.dataset.productId : null;
            console.log(productId)

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
                body: requestData
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('Response:', data.message);
                const messageContainer = document.querySelector('.quote-message-container');
                if (messageContainer) {
                    messageContainer.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});
