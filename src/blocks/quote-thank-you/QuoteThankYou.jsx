import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getApiLink } from "../../services/apiService";
import { __ } from "@wordpress/i18n";
import axios from 'axios';

const QuoteThankYou = () => {
    const [orderId, setOrderId] = useState(0);
    const [status, setStatus] = useState('');
    const [reason, setReason] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  
    const location = useLocation();
  
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const orderIdParam = params.get('order_id');
      const statusParam = params.get('status');
  
      setOrderId(orderIdParam);
      setStatus(statusParam || '');
    }, [location]);

    const handleRejectQuote = () => {
        axios({
			method: "post",
			url: getApiLink('reject-quote-my-acount'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				orderId: orderId,
                status: status,
                reason: reason,
			},
		}).then((response) => {
            setSuccessMessage(response.data.message);
		});
    }

    return (
        <>
            {orderId && status ? (
                <div class="reject-quote-from-mail">
                    <div class="reject-content">
                        <p>{__( 'You are about to reject the quote {orderId}', 'woocommerce-catalog-enquiry' )}</p>
                        <p>
                            <label> {__( 'Please feel free to enter here your reason or provide us your feedback:', 'woocommerce-catalog-enquiry' )}</label>
                            <textarea name="reason" id="reason" cols="10" rows="3" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                        </p>
                            <button onClick={handleRejectQuote}>{__( 'Reject the quote', 'woocommerce-catalog-enquiry' )}</button>
                    </div>
                </div>
            ) : ( orderId && (
                <div>
                    <p>Thank you for your quote request <strong>{orderId}</strong>.</p>
                    <p>{__('Our team is reviewing your details and will get back to you shortly with a personalized quote. We appreciate your patience and look forward to serving you!', 'woocommerce-catalog-enquiry')}</p>
                </div>
                ))
            }
            
            <div className="success-message">{successMessage}</div>
        </>
    );
}

export default QuoteThankYou;
