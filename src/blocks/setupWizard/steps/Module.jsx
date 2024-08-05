import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';
import Loading from './Loading';

const Modules = (props) => {
    const { onNext, onPrev } = props;
    const [loading, setLoading] = useState(false);
    const [selectedModules, setSelectedModules] = useState({
        catalog: false,
        enquiry: false,
        quote: false,
        wholesale: false
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedModules((prevState) => ({
            ...prevState,
            [name]: checked
        }));
    };

    const moduleSave = () => {
        setLoading(true);
		const modulesToSave = Object.keys(selectedModules).filter(key => selectedModules[key]);
        axios({
            method: "post",
            url: getApiLink('module-save'),
            headers: { "X-WP-Nonce": appLocalizer.nonce },
            data: {modules : modulesToSave}
        }).then((response) => {
            setLoading(false);
            onNext();
        });
    };

    return (
        <section>
            <h2>Modules</h2>
            <article className='module-wrapper'>
                <div className="module-items">
                    <p>Catalog</p>
                    <div className='toggle-checkbox'>
                        <input
                            type="checkbox"
                            id="catalog"
                            name="catalog"
                            checked={selectedModules.catalog}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="catalog"></label>
                    </div>
                </div>
                
                <div className="module-items">
                    <p>Enquiry</p>
                    <div className='toggle-checkbox'>
                        <input
                            type="checkbox"
                            id="enquiry"
                            name="enquiry"
                            checked={selectedModules.enquiry}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="enquiry"></label>
                    </div>
                </div>
                
                <div className="module-items">
                    <p>Quote</p>
                    <div className='toggle-checkbox'>
                        <input
                            type="checkbox"
                            id="quote"
                            name="quote"
                            checked={selectedModules.quote}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="quote"></label>
                    </div>
                </div>
                
                <div className="module-items">
                    <p>Wholesale</p>
                    <div className='toggle-checkbox'>
                        <input
                            type="checkbox"
                            id="wholesale"
                            name="wholesale"
                            checked={selectedModules.wholesale}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="wholesale"></label>
                    </div>
                </div>
            </article>
            <footer className='setup-footer-btn-wrapper'>
                <div>
                    <button className='footer-btn pre-btn' onClick={onPrev}>Prev</button>
                    <button className='footer-btn ' onClick={onNext}>Skip</button>
                </div>
                <button className='footer-btn next-btn' onClick={moduleSave}>Next</button>
            </footer>
            {loading && <Loading />}
        </section>
    );
};

export default Modules;
