import { useState, useEffect } from 'react';

const Textarea = (props) => {
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
            <textarea
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

            {/* Display metabox */}
            <div className='input-meta'>
                {/* row */}
                <div>
                    <div>Number of rows</div>
                    <input
                        type='number'
                        min="1" max="1000"
                        value={formField.row}
                        onChange={(event) => {
                            onChange('row', event.target.value);
                        }}
                    />
                </div>
                {/* column */}
                <div>
                    <div>Number of columns</div>
                    <input
                        type='number'
                        min="1" max="1000"
                        value={formField.col}
                        onChange={(event) => {
                            onChange('col', event.target.value);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Textarea;