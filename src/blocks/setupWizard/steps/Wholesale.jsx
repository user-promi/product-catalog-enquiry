import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';

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
        <div>
            <h2>Wholesale</h2>

            <div>
                <label htmlFor="wholesale_discount_type">Wholesale type</label>
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

            <div>
                <label htmlFor="wholesale_amount">Wholesale Amount</label>
                <input
                    type="number"
                    id="wholesale_amount"
                    name="wholesale_amount"
                    value={wholesaleAmount}
                    onChange={handleWholesaleAmountChange}
                />
            </div>

            <div>
                <label htmlFor="minimum_quantity">Minimum Quantity</label>
                <input
                    type="number"
                    id="minimum_quantity"
                    name="minimum_quantity"
                    value={minimumQuantity}
                    onChange={handleMinimumQuantityChange}
                />
            </div>

            <div>
                <button onClick={onPrev}>Prev</button>
                <button onClick={onFinish}>Skip</button>
                <button onClick={saveWholesaleSettings}>Finish</button>
            </div>

            {loading && <div> Loading... </div>}
        </div>
    );
};

export default Wholesale;
