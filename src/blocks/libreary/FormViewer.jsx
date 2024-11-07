import { useState, useEffect } from 'react';
import Select from 'react-select';
import Button from './Button';
import './FromViewer.scss';
import ReCAPTCHA from "react-google-recaptcha";

/**
 * Render checkboxes
 * @param {*} props 
 * @returns 
 */
const Checkboxes = (props) => {
    const { options, onChange } = props;

    const [checkedItems, setCheckedItems] = useState(options.filter(({ isdefault }) => isdefault));

    useEffect(() => {
        onChange(checkedItems.map((item) => item.value));
    }, [checkedItems])

    const handleChange = (option, checked) => {
        const newCheckedItems = checkedItems.filter((item) => item.value != option.value);

        if (checked) {
            newCheckedItems.push(option);
        }

        setCheckedItems(newCheckedItems);
    }

    return (
        <div className='multiselect-container items-wrapper'>
            {
                options.map((option, index) => {
                    return (
                        <div key={index} className='select-items'>
                            <input
                                type="checkbox"
                                id={index}
                                checked={checkedItems.find((item) => item.value === option.value)}
                                onChange={(e) => handleChange(option, e.target.checked)}
                            />
                            <label htmlFor={index}>
                                {option.label}
                            </label>
                        </div>
                    );
                })
            }
        </div>
    );
}

/**
 * Render Multiselect
 * @param {*} props 
 * @returns 
 */
const Multiselect = (props) => {
    const { options, onChange, isMulti } = props;

    const [selectedOptions, setSelectedOptions] = useState(() => {
        if (isMulti) {
            return options.filter(({ isdefault }) => isdefault);
        } else {
            return options.find(({ isdefault }) => isdefault);
        }
    });

    useEffect(() => {
        if (isMulti) {
            onChange(selectedOptions.map((option) => option.value));
        } else {
            onChange(selectedOptions.value);
        }
    }, [selectedOptions])

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    return (
        <Select
            isMulti={isMulti}
            value={selectedOptions}
            onChange={handleChange}
            options={options}
        />
    );
}

/**
 * Render radio
 * @param {*} props 
 */
const Radio = (props) => {
    const { options, onChange } = props;

    const [selectdedItem, setSelectdedItem] = useState(options.find(({ isdefault }) => isdefault)?.value);

    useEffect(() => {
        onChange(selectdedItem);
    }, [selectdedItem])

    const handleChange = (e) => {
        setSelectdedItem(e.target.value);
    }

    return (
        <div className='multiselect-container items-wrapper'>
            {
                options.map((option, index) => {
                    return (
                        <div key={index} className='select-items'>
                            <input
                                type="radio"
                                id={index}
                                value={option.value}
                                checked={selectdedItem === option.value}
                                onChange={handleChange}
                            />
                            <label htmlFor={index}>
                                {option.label}
                            </label>
                        </div>
                    );
                })
            }
        </div>
    );
}

/**
 * Pro form components
 * @param {*} props 
 * @returns 
 */
const FromViewer = (props) => {

    const { formFields, onSubmit } = props;

    const [inputs, setInputs] = useState({});

    // Get the from list and button settings
    const formList = formFields.formfieldlist || [];
    const buttonSetting = formFields.butttonsetting || {}
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    /**
     * Handle input change
     * @param {*} e 
     */
    const handleChange = (name, value) => {
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handle input submit
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        for (const key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                data.append(key, inputs[key]);
            }
        }

        onSubmit(data);
    }

    const [ defaultDate, setDefaultDate ] = useState(new Date().getFullYear()+'-01-01')

    return (
        <main className='enquiry-pro-form'>
            {
                formList.map((field) => {
                    if (field.disabled) { return }

                    switch (field.type) {
                        case "title":
                            return (
                                <section className="form-title"> {field.label} </section>
                            );
                        case "text":
                            return (
                                <section className='form-text form-pro-sections'>
                                    <label>{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={inputs[field.name]}
                                        placeholder={field.placeholder}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                        maxLength={field.charlimit}
                                    />
                                </section>
                            );
                        case "email":
                            return (
                                <section className='form-email form-pro-sections'>
                                    <label>{field.label}</label>
                                    <input
                                        type="email"
                                        name={field.name}
                                        value={inputs[field.name]}
                                        placeholder={field.placeholder}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                        maxLength={field.charlimit}
                                    />
                                </section>
                            );
                        case "textarea":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <textarea
                                        name={field.name}
                                        value={inputs[field.name]}
                                        placeholder={field.placeholder}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                        maxLength={field.charlimit}
                                        rows={field.row}
                                        cols={field.col}
                                    />
                                </section>
                            );
                        case "checkboxes":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <Checkboxes
                                        options={field.options}
                                        onChange={(data) => handleChange(field.name, data)}
                                    />
                                </section>
                            );
                        case "multiselect":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <div className='multiselect-container'>
                                        <Multiselect
                                            options={field.options}
                                            onChange={(data) => handleChange(field.name, data)}
                                            isMulti
                                        />
                                    </div>
                                </section>
                            );
                        case "dropdown":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <div className='multiselect-container'>
                                        <Multiselect
                                            options={field.options}
                                            onChange={(data) => handleChange(field.name, data)}
                                        />
                                    </div>
                                </section>
                            );
                        case "radio":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <Radio
                                        options={field.options}
                                        onChange={(data) => handleChange(field.name, data)}
                                    />
                                </section>
                            );
                        case "recapta":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <div className='recaptcha-wrapper'>
                                        <ReCAPTCHA
                                            sitekey={field.sitekey}
                                            onChange={handleCaptchaChange}
                                        />
                                    </div>
                                </section>
                            );
                        case "attachment":
                            return (
                                <section className='form-pro-sections'>
                                    <label>{field.label}</label>
                                    <div className="attachment-section">
                                        <label
                                            htmlFor="dropzone-file"
                                            className="attachment-label"
                                        >
                                            <div className="wrapper">
                                                <svg
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="heading">
                                                    <span>Click to upload</span> or drag and drop
                                                </p>
                                            </div>
                                            <input readOnly id="dropzone-file" type="file" className="hidden" />
                                        </label>
                                    </div>
                                </section>
                            );
                        case "datepicker":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <div className='date-picker-wrapper'>
                                        <input
                                            type='date'
                                            value={inputs[field.name] || defaultDate}
                                            onChange={(e) => { handleChange(field.name, e.target.value) }}
                                        />
                                    </div>
                                </section>
                            );
                        case "timepicker":
                            return (
                                <section className=' form-pro-sections'>
                                    <label>{field.label}</label>
                                    <input
                                        type='time'
                                        value={inputs[field.name]}
                                        onChange={(e) => { handleChange(field.name, e.target.value) }}
                                    />
                                </section>
                            );
                        case "section":
                            return (
                                <section className=' form-pro-sections'>
                                    {field.label}
                                </section>
                            );
                        case "divider":
                            return(
                                <section className='section-divider-container'></section>
                            )
                    }
                })
            }

            <section className='popup-footer-section'>
                <Button
                    customStyle={buttonSetting}
                    onClick={(e) => {
                        const captcha = formFields.formfieldlist?.find((field)=> field.key == "recapta");
                        if (captcha && !captchaToken) 
                            return
                        handleSubmit(e)
                    }}
                    children={'submit'}
                />
                <button id='close-enquiry-popup' className='close-enquiry-popup'>Close</button>
            </section>

        </main>
    );
}

export default FromViewer;