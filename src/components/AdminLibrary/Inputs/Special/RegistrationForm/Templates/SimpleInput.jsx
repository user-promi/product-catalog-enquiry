import { useState, useEffect } from 'react';

const SimpleInput = (props) => {
    const { formField, onChange } = props;
    const [showTextBox, setShowTextBox] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const closePopup = () => {
            if (event.target.closest('.meta-setting-modal, .react-draggable')) {
                return;
            }
            setIsClicked(false);
            setShowTextBox(false);
        };
        document.body.addEventListener("click", closePopup);
        return () => {
            document.body.removeEventListener("click", closePopup);
        };
    }, []);

    return (
        <>
        {!showTextBox && (
            <div
                onMouseEnter={() => setShowTextBox(true)} 
                style={{ cursor: 'pointer' }}
            >
                <div className="edit-form-wrapper">        
                    <p>I am default simple label</p>
                    <div className="settings-form-group-radio">
                        <input
                            className='input-text-section simpleInput-text-input'
                            type="text"
                            placeholder={formField.placeholder}
                        />
                    </div>
                </div>
            </div>
        )}

        {showTextBox && (
            <div className='main-input-wrapper'
                onClick={() => {
                    setShowTextBox(true); 
                    setIsClicked(true);
                }}
                onMouseLeave={() => !isClicked && setShowTextBox(false)}
            >
                {/* Render label */}
                <input
                    className='input-label simpleInput-label'
                    type="text"
                    value={formField.label}
                    onChange={(event) => { onChange('label', event.target.value) }}
                />

                {/* Render Inputs */}
                <input
                    className='input-text-section simpleInput-text-input'
                    type="text"
                    readOnly
                    placeholder={formField.placeholder}
                />
            </div>
        )}
        </>
    )
}

export default SimpleInput;