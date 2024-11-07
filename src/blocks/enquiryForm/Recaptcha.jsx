import { useState, useEffect } from 'react';

const Recaptcha = (props) => {
    const {captchaValid } = props;
    const [securityCode, setSecurityCode] = useState('');
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        // Generate a random 6-digit code
        const generateCode = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        setSecurityCode(generateCode());
    }, []);

    const captchCheck = (e) => {
        e.preventDefault();
        let value = e.target.value;
        captchaValid(value === securityCode);
    };

    return (
        <>
       <input
          type="text"
          id="securityCode"
          name="securityCode"
          onChange={captchCheck}
        />
        <p>Your security code is: {securityCode}</p>
        </>
    );
}
export default Recaptcha;