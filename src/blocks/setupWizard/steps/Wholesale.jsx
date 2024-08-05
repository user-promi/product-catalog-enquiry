import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';
import Loading from './Loading';

const Wholesale = (props) => {
    const { onFinish, onPrev } = props;
    const [loading, setLoading] = useState(false);
    const [wholesaleType, setWholesaleType] = useState('fixed_amount');
    const [wholesaleAmount, setWholesaleAmount] = useState(0);
    const [minimumQuantity, setMinimumQuantity] = useState(0);

    const handleWholesaleTypeChange = (event) => {
        setWholesaleType(event.target.value);
    };

    const handleWholesaleAmountChange = (event) => {
        setWholesaleAmount(event.target.value);
    };

    const handleMinimumQuantityChange = (event) => {
        setMinimumQuantity(event.target.value);
    };

    const saveWholesaleSettings = () => {
        setLoading(true);
        const data = {
            action: 'wholesale',
            wholesaleType: wholesaleType,
            wholesaleAmount: wholesaleAmount,
            minimumQuantity: minimumQuantity
        };

        axios({
            method: "post",
            url: getApiLink('save-settings'),
            headers: { "X-WP-Nonce": appLocalizer.nonce },
            data: data
        }).then((response) => {
            setLoading(false);
            onFinish();
        });
    };

    return (
        <section>
            <h2>Wholesale</h2>

            <article className='module-wrapper'>
                <div className='module-items'>
                    <p>Display Enquiry Form:</p>
                    <div className='input-container'>
                        <select
                            id="wholesale_discount_type"
                            name="wholesale_discount_type"
                            value={wholesaleType}
                            onChange={handleWholesaleTypeChange}
                        >
                            <option value="fixed_amount">Fixed Amount</option>
                            <option value="percentage_amount">Percentage Amount</option>
                        </select>
                    </div>
                </div>
            </article>
            <article className='module-wrapper'>
                <div className='module-items'>
                    <p>Wholesale Amount</p>
                    <div className='input-container'>
                    <input
                        type="number"
                        id="wholesale_amount"
                        name="wholesale_amount"
                        value={wholesaleAmount}
                        onChange={handleWholesaleAmountChange}
                    />
                    </div>
                </div>
            </article>
            <article className='module-wrapper'>
                <div className='module-items'>
                    <p>Minimum Quantity</p>
                    <div className='input-container'>
                    <input
                        type="number"
                        id="minimum_quantity"
                        name="minimum_quantity"
                        value={minimumQuantity}
                        onChange={handleMinimumQuantityChange}
                    />
                    </div>
                </div>
            </article>

            <footer className='setup-footer-btn-wrapper'>
                <div>
                    <button className='footer-btn pre-btn' onClick={onPrev}>Prev</button>
                    <button className='footer-btn ' onClick={onFinish}>Skip</button>
                </div>
                <button className='footer-btn next-btn' onClick={saveWholesaleSettings}>Finish</button>
            </footer>
            {loading && <Loading />}
        </section>
    );
};

export default Wholesale;
