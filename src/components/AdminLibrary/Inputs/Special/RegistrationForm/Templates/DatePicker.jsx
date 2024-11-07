import { useState, useEffect } from 'react';

const Datepicker = (props) => {
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
                        <input type="date" readOnly />
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

                {/* Render attachments */}
                <input type="date" readOnly />
            </div>
        )}
        </>
    )
}

export default Datepicker;
