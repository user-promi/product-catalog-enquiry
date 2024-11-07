import { useState, useEffect } from 'react';
import Select from 'react-select';
import './EnquiryForm.scss';
import FromViewer from '../libreary/FormViewer';
import axios from 'axios';
import Recaptcha from './Recaptcha';

/**
 * Free form components
 * @param {*} props 
 * @returns 
 */
const FreeForm = (props) => {
    let { formFields, onSubmit } = props;
    if(!formFields) formFields = [];

    const [inputs, setInputs] = useState({});
    const [ fileName, setFileName ] = useState("");
    const [ captchaStatus, setCaptchaStatus] = useState(false);

    /**
     * Handle input change
     * @param {*} e 
     */
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFileName( e.target.files[0].name )
            setInputs((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        } else {
            setInputs((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
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

    return (
        <div className='enquiry-free-form'>
            {
                formFields.map((field) => {
                    if (!field.active) { return }

                    switch (field.key) {
                        case "name":
                            return (
                                <div className='form-free-sections'>
                                    <label>{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.key}
                                        value={inputs[field.key]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            );
                        case "email":
                            return (
                                <div className='form-free-sections'>
                                    <label>{field.label}</label>
                                    <input
                                        type="email"
                                        name={field.key}
                                        value={inputs[field.key]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            );
                        case "phone":
                            return (
                                <div className='form-free-sections'>
                                    <label>{field.label}</label>
                                    <input
                                        type="number"
                                        name={field.key}
                                        value={inputs[field.key]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            );
                        case "address":
                        case "subject":
                        case "comment":
                            return (
                                <div className='form-free-sections'>
                                    <label>{field.label}</label>
                                    <textarea
                                        name={field.key}
                                        value={inputs[field.key]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            );
                        case "fileupload":
                            return (
                                <div className='form-free-sections'>
                                    <label className='attachment-main-label'>{field.label}</label>
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
                                                    {fileName == '' ? (
                                                        <>
                                                            <span>Click to upload</span> or drag and drop
                                                        </>
                                                    ) : fileName}
                                                </p>
                                            </div>
                                            <input 
                                                name={field.key}
                                                onChange={handleChange}
                                                required id="dropzone-file" 
                                                type="file" 
                                                className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            );
                        case "captcha":
                            return (
                                <div className='form-free-sections'>
                                    <label>{field.label}</label>
                                    <div className='recaptcha-wrapper'>
                                        <Recaptcha
                                            captchaValid = {(validStatus) => setCaptchaStatus(validStatus)}
                                        />
                                    </div>
                                </div>
                            );
                    }
                })
            }

           <section className='popup-footer-section'>
                <button onClick={(e) => {
                    const captcha = formFields?.find((field)=> field.key == "captcha");
                    if (captcha?.active && !captchaStatus) 
                        return
                    handleSubmit(e)
                }}>
                    Submit</button>

                <button id='close-enquiry-popup' className='close-enquiry-popup'>Close</button>
           </section>
        </div>
    );
}

const EnquiryForm = (props) => {
    const [ loading, setLoading ] = useState(false);
    const [ toast, setToast ] = useState(false);
    const [ responseMessage, setResponseMessage ] = useState('');
    const formData = enquiry_form_data;
    const proActive = formData.pro_active;

    const submitUrl = `${enquiry_form_data.apiurl}/catalog/v1/save-form-data`;

    const onSubmit = (formData) => {
        setLoading(true);
      
        let productId = document.querySelector('#product-id-for-enquiry').value;
        let quantity = document.querySelector('.quantity .qty');
        if (quantity == null) {
            quantity = 1;
        } else {
            quantity = quantity.value;
        }

        formData.append('productId', productId);
        formData.append('quantity', quantity);

        axios.post(submitUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              "X-WP-Nonce": enquiry_form_data.nonce
            },
          })
          .then(response => {
            setResponseMessage(response.data.msg)
            setLoading(false);
            setToast(true);
            if(response.data.redirect_link !== ''){
                window.location.href = response.data.redirect_link;
            }
            setTimeout(() => {
                setToast(false);
                window.location.reload();
            }, 3000);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }

    return (
        <div className='enquiry-form-modal'>
            {toast && 
               <div className="admin-notice-display-title">
                    <i className="admin-font font-icon-yes"></i>
                    {responseMessage}
                </div>
            }
            {loading &&
                <section className='loader-component'>
                    <div class="three-body">
                        <div class="three-body__dot"></div>
                        <div class="three-body__dot"></div>
                        <div class="three-body__dot"></div>
                    </div>
                </section>
            }
            <div className='modal-wrapper'>
                <div className='modal-close-btn'>
                    <i className='admin-font font-cross'></i>
                </div>
                <div>{enquiry_form_data.content_before_form}</div>
                {
                    proActive ?
                    <FromViewer
                        formFields={formData.settings_pro}
                        onSubmit={onSubmit}
                    />
                    :
                    <FreeForm
                        formFields={formData.settings_free}
                        onSubmit={onSubmit}
                    />
                }
                <div>{enquiry_form_data.content_after_form}</div>
            </div>
        </div>
    );
}

export default EnquiryForm;