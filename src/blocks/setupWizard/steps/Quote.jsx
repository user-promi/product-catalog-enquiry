import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';
import Loading from './Loading';

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
        <section>
            <h2>Quote</h2>
            <article className='module-wrapper'>
                <div className="module-items">
                    <p>Restrict for logged-in user</p>
                    <div className='toggle-checkbox'>
                        <input
                            type="checkbox"
                            id="logged_out"
                            name="logged_out"
                            checked={restrictUserQuote.includes('logged_out')}
                            onChange={handleRestrictUserQuoteChange}
                        />
                        <label htmlFor='logged_out'></label>
                    </div>
                </div>
            </article>

            <footer className='setup-footer-btn-wrapper'>
                <div>
                    <button className='footer-btn pre-btn' onClick={onPrev}>Prev</button>
                    <button className='footer-btn ' onClick={onNext}>Skip</button>
                </div>
                <button className='footer-btn next-btn' onClick={saveQuoteSettings}>Next</button>
            </footer>
            {loading && <Loading />}
        </section>
    );
};

export default Quote;
