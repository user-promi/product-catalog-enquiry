import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';

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
        <div>
            <h2>Enquiry</h2>
            <div>
                <label>Display Enquiry Form:</label>
                <div>
                    <input
                        type="radio"
                        id="popup"
                        name="display_option"
                        value="popup"
                        checked={displayOption === 'popup'}
                        onChange={handleDisplayOptionChange}
                    />
                    <label htmlFor="popup">Popup</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="inline"
                        name="display_option"
                        value="inline"
                        checked={displayOption === 'inline'}
                        onChange={handleDisplayOptionChange}
                    />
                    <label htmlFor="inline">Inline</label>
                </div>
            </div>
            <div>
                <label>Restrict for logged-in user</label>
                <input
                    type="checkbox"
                    id="enquiry_logged_out"
                    name="enquiry_logged_out"
                    checked={restrictUserEnquiry.includes('enquiry_logged_out')}
                    onChange={handleRestrictUserEnquiryChange}
                />
            </div>

            <div>
                <button onClick={onPrev}>Prev</button>
                <button onClick={onNext}>Skip</button>
                <button onClick={saveEnquirySettings}>Next</button>
            </div>

            {loading && <div> Loading... </div>}
        </div>
    );
};

export default Enquiry;
