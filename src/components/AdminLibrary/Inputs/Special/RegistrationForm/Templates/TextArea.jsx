import { useState, useEffect } from 'react';

const Textarea = (props) => {
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
                    <p>{formField.label}</p>
                    <div className="settings-form-group-radio">
                        <input
                            className='input-text-section textArea-text-input'
                            type="text"
                            value={formField.placeholder}
                            placeholder={"I am input placeholder"}
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
                    className='input-label textArea-label'
                    type="text"
                    value={formField.label}
                    placeholder={"I am label"}
                    onChange={(event) => {
                        onChange('label', event.target.value);
                    }}
                />

                {/* Render placeholder */}
                <input
                    className='input-text-section textArea-text-input'
                    type="text"
                    value={formField.placeholder}
                    placeholder={"I am input placeholder"}
                    readOnly={true}
                />
            </div>
        )}
        </>
    )
}

export default Textarea;