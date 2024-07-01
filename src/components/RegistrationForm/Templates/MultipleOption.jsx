import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { FaArrowsAlt } from 'react-icons/fa';

const MultipleOptions = (props) => {
    const { formField, onChange } = props;

    const [clickedElement, setClickedElement] = useState();
    const [options, setOptions] = useState(() => {
        if (Array.isArray(formField.options) && formField.options.length) {
            return formField.options;
        }
    
        return [
            {
                label: 'I have a bike',
                value: 'bike'
            },
            {
                label: 'I have a car',
                value: 'car'
            },
            {
                label: 'I have a boat',
                value: 'boat'
            }
        ];
    });

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

    useEffect(() => {
        onChange('options', options);
    }, [options]);

    ///////////////////////////////////////// Functionality for button change /////////////////////////////////////////
    
    /**
     * Handle the field change of option
     */
    const handleOptionFieldChange = (index, key, value) => {
        // copy the form field before modify
        const newOptions = [ ...options ]
        
        // Update the new form field list
        newOptions[index] = {
            ...newOptions[index],
            [key]: value
        }

        // Update the state variable
        setOptions(newOptions);
    }

    /**
     * Insert a new option at end of option list
     */
    const handleInsertOption = () => {
        setOptions([...options, {
            label: 'I am label',
            value: 'value'
        }]);
    }

    /**
     * Handle the delete a particular option options
     * it will not work if only one option is set
     */
    const handleDeleteOption = (index) => {
        if (options.length <= 1) {
            return;
        }
        
        // Create a new array without the element at the specified index
        const newOptions = options.filter((_, i) => i !== index);

        // Update the state with the new array
        setOptions(newOptions);
    }

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

            {/* Render Options */}
            <ReactSortable
                list={options}
                setList={(newList) => { setOptions(newList)}}
                handle=".drag-handle-option"
            >
                {
                    options && options.map((option, index) => (
                        <div className="option">
                            {/* Render grab icon for drag and drop */}
                            <span className="drag-handle-option" style={{  cursor: 'grab' }}>
                                <FaArrowsAlt />
                            </span>

                            {/* Render label modifire */}
                            <div className="label">
                                <input
                                    type="text"
                                    value={option.label}
                                    onChange={(event) => {
                                        handleOptionFieldChange(index, 'label', event.target.value);
                                    }}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                    }}
                                />
                            </div>

                            {/* Render value modifire */}
                            <div className="value">
                                <input
                                    type="text"
                                    value={option.value}
                                    onChange={(event) => {
                                        handleOptionFieldChange(index, 'value', event.target.value);
                                    }}
                                    onClick={(event) => {
                                        event.stopPropagation()
                                    }}
                                />
                            </div>

                            {/* Render delete option */}
                            <div onClick={() => handleDeleteOption(index)}>Delete</div>
                        </div>
                    ))
                }

                {/* Render add option at last */}
                <div onClick={() => handleInsertOption()}>+</div>
            </ReactSortable>

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

export default MultipleOptions;