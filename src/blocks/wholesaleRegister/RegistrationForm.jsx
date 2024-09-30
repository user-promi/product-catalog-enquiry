import FromViewer from "../libreary/FormViewer";
import axios from 'axios';

const RegistrationForm = (props) => {
    const submitUrl = `${wholesale_form_data.apiurl}/catalog/v1/wholesale-register`;
    const formFields = wholesale_form_data.from_settings || {};
    const userId = wholesale_form_data.user_id;

    const handleSubmit = (formData) => {
        formData.append( 'userid', userId );
        axios.post(submitUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            // console.log(response.data);
            window.location.href = response.data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <div className="registration-form-container">
            {
                <FromViewer
                    formFields={formFields}
                    onSubmit={(data) => handleSubmit(data)}
                />
            }
        </div>
    );
}

export default RegistrationForm;