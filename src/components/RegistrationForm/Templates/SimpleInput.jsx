import { useState, useEffect } from 'react';

const SimpleInput = (props) => {
    const { formField, onChange } = props;

    const [ clickedElement, setClickedElement ] = useState();

    useEffect(() => {
        const handleClick = (event) => {
            setClickedElement();
        };
    
        // Adding event listener to 'click' event when component mounts
        document.addEventListener('click', handleClick);
    
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div>
            {/* Render label */}
            <input
                type="text"
                value={formField.label}
                placeholder={"I am label"}
                onChange={(event) => {
                    onChange('label', event.target.value);
                }}
                onClick={(event) => {
                    setClickedElement('label');
                    event.stopPropagation()
                }}
                readOnly={ clickedElement !== 'label'}
            />

            {/* Render Inputs */}
            <input
                type="text"
                value={formField.placeholder}
                placeholder={"I am input placeholder"}
                onChange={(event) => {
                    onChange('placeholder', event.target.value);
                }}
                onClick={(event) => {
                    setClickedElement('placeholder');
                    event.stopPropagation()
                }}
                readOnly={clickedElement !== 'placeholder'}
            />

            {/* Render Description */}
            <input
                type="text"
                value={formField.description}
                placeholder={"I am input description"}
                onChange={(event) => {
                    onChange('description', event.target.value);
                }}
                onClick={(event) => {
                    setClickedElement('description');
                    event.stopPropagation()
                }}
                readOnly={clickedElement !== 'description'}
            />
        </div>
    )
}

export default SimpleInput;