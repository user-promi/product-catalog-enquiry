import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';

const Quote = (props) => {
    const { onNext, onPrev } = props;
    const [loading, setLoading] = useState(false);
    const [restrictUserQuote, setRestrictUserQuote] = useState([]);

    const handleRestrictUserQuoteChange = (event) => {
        const { checked, name } = event.target;
        setRestrictUserQuote((prevState) =>
            checked ? [...prevState, name] : prevState.filter(value => value !== name)
        );
    };

    const saveQuoteSettings = () => {
        setLoading(true);
        const data = {
            action: 'quote',
            restrictUserQuote: restrictUserQuote
        };

        axios({
            method: "post",
            url: getApiLink('save-settings'),
            headers: { "X-WP-Nonce": appLocalizer.nonce },
            data: data
        }).then((response) => {
            setLoading(false);
            onNext();
        });
    };

    return (
        <div>
            <h2>Quote</h2>
            <div>
                <label>Restrict for logged-in user</label>
                <input
                    type="checkbox"
                    id="logged_out"
                    name="logged_out"
                    checked={restrictUserQuote.includes('logged_out')}
                    onChange={handleRestrictUserQuoteChange}
                />
            </div>

            <div>
                <button onClick={onPrev}>Prev</button>
                <button onClick={onNext}>Skip</button>
                <button onClick={saveQuoteSettings}>Next</button>
            </div>

            {loading && <div> Loading... </div>}
        </div>
    );
};

export default Quote;
