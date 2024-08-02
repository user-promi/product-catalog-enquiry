import React, { useState } from 'react';
import { getApiLink } from "../../../services/apiService";
import axios from 'axios';

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
        <div>
            <h2>Modules</h2>
            <div>
                <label htmlFor="catalog">Catalog</label>
                <input
                    type="checkbox"
                    id="catalog"
                    name="catalog"
                    checked={selectedModules.catalog}
                    onChange={handleCheckboxChange}
                />
            </div>
            
            <div>
                <label htmlFor="enquiry">Enquiry</label>
                <input
                    type="checkbox"
                    id="enquiry"
                    name="enquiry"
                    checked={selectedModules.enquiry}
                    onChange={handleCheckboxChange}
                />
            </div>
            
            <div>
                <label htmlFor="quote">Quote</label>
                <input
                    type="checkbox"
                    id="quote"
                    name="quote"
                    checked={selectedModules.quote}
                    onChange={handleCheckboxChange}
                />
            </div>
            
            <div>
                <label htmlFor="wholesale">Wholesale</label>
                <input
                    type="checkbox"
                    id="wholesale"
                    name="wholesale"
                    checked={selectedModules.wholesale}
                    onChange={handleCheckboxChange}
                />
            </div>

            <div>
                <button onClick={onPrev}>Prev</button>
                <button onClick={onNext}>Skip</button>
                <button onClick={moduleSave}>Next</button>
            </div>

            {loading && <div> Loading... </div>}
        </div>
    );
};

export default Modules;
