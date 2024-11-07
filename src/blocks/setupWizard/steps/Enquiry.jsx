import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';
import Loading from './Loading';

const Enquiry = (props) => {
    const { onNext, onPrev } = props;
    const [loading, setLoading] = useState(false);
    const [displayOption, setDisplayOption] = useState('popup');
    const [restrictUserEnquiry, setRestrictUserEnquiry] = useState([]);

    const handleDisplayOptionChange = (event) => {
        setDisplayOption(event.target.value);
    };

    const handleRestrictUserEnquiryChange = (event) => {
        const { checked, name } = event.target;
        setRestrictUserEnquiry((prevState) =>
            checked ? [...prevState, name] : prevState.filter(value => value !== name)
        );
    };

    const saveEnquirySettings = () => {
        setLoading(true);
        const data = {
            action: 'enquiry',
            displayOption: displayOption,
            restrictUserEnquiry: restrictUserEnquiry
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
            <h2>Enquiry</h2>
            <article className='module-wrapper'>
                <div className='module-items'>
                    <p>Display Enquiry Form:</p>
                    <ul>
                        <li>
                            <input className="toggle-setting-form-input" type="radio" id="popup" name="approve_vendor" value="popup" checked={displayOption === 'popup'} />
                            <label for="popup" onClick={(e) => setDisplayOption('popup')}>Popup</label>
                        </li>
                        <li>
                            <input className="toggle-setting-form-input" type="radio" id="inline" name="approve_vendor" value="inline" checked={displayOption === 'inline'} />
                            <label for="inline" onClick={(e) => setDisplayOption('inline')}>Inline In-page</label>
                        </li>
                    </ul>
                </div>
            </article>
            <article className='module-wrapper'>
                <div className="module-items">
                    <p>Restrict for logged-in user</p>
                    <div className='toggle-checkbox'>
                        <input
                            type="checkbox"
                            id="enquiry_logged_out"
                            name="enquiry_logged_out"
                            checked={restrictUserEnquiry.includes('enquiry_logged_out')}
                            onChange={handleRestrictUserEnquiryChange}
                        />
                        <label htmlFor='enquiry_logged_out'></label>
                    </div>
                </div>
            </article>

            <footer className='setup-footer-btn-wrapper'>
                <div>
                    <button className='footer-btn pre-btn' onClick={onPrev}>Prev</button>
                    <button className='footer-btn ' onClick={onNext}>Skip</button>
                </div>
                <button className='footer-btn next-btn' onClick={saveEnquirySettings}>Next</button>
            </footer>
            {loading && <Loading />}
        </section>
    );
};

export default Enquiry;
