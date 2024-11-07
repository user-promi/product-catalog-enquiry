import React, { useState, useEffect, useRef } from 'react';
import './MergeComponent.scss';
import Select from 'react-select';

const MergeComponent = (props) => {
    const { wrapperClass, descClass, description, onChange, value, proSetting, fields = [], optionFields = {}, placeholderFields = [] } = props;
    const firstRender = useRef(true);
    const [data, setData] = useState({
        [fields[0]]: value[fields[0]] || '',
        [fields[1]]: value[fields[1]] || '',
        [fields[2]]: value[fields[2]] || ''
    });

    const handleOnChange = (key, value) => {
        setData((previousData) => {
            return{...previousData, [key] : value }
        })
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return; // Prevent the initial call
        }
        onChange(data)
      }, [data]);

    return (
        <>
            <main className={wrapperClass}>
                <section className='select-input-section merge-components'>
                    <select id={fields[0]} value={data[fields[0]]} onChange={(e) => handleOnChange([fields[0]], e.target.value)}>
                        <option value="">Select</option>
                        {Object.keys(optionFields).map((key) => (
                            <option key={key} value={key}>{optionFields[key]}</option>
                        ))}
                    </select>

                    <input type="number" id={fields[1]} placeholder={placeholderFields[0] || "Enter a value"} min="1" value={data[fields[1]]} onChange={(e) => handleOnChange(fields[1], e.target.value)}/>
                    
                    <input type="number" id={fields[2]} min="1" placeholder={placeholderFields[1] || "Enter a value"} value={data[fields[2]]} onChange={(e) => handleOnChange(fields[2], e.target.value)}/>
                </section>
                {
                    description &&
                    <p className={descClass} dangerouslySetInnerHTML={{ __html: description }} >
                    </p>
                }
                { proSetting && <span className="admin-pro-tag">pro</span> }
            </main>
        </>
    )
}

export default MergeComponent