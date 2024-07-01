import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { FaArrowsAlt } from 'react-icons/fa';
import Template from "./Templates";

// Sample data for testings
const sampleArray = [
    {
        id: 1,
        type: 'title',
        label: 'This is form editor',
        required: true,
    },
    {
      id: 2,
      type: 'textarea',
      label: 'First Name',
      placeholder: 'Enter your first name',
      description: 'Your given name',
      required: true,
    },
    {
      id: 3,
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      description: 'Your family name',
      required: true,
    },
    {
      id: 4,
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      description: 'We will not share your email with anyone',
      required: true,
    },
    {
      id: 5,
      type: 'password',
      label: 'Password',
      placeholder: 'Create a password',
      description: 'Must be at least 8 characters long',
      required: true,
    },
    {
      id: 6,
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      description: 'Include country code if outside the US',
      required: false,
    },
    {
      id: 7,
      type: 'checkboxes',
      label: 'What you have',
      placeholder: '',
      description: 'If you have not any car you are poor!!!',
      required: false,
    }
];

const selectOptions = [
    {
        icon: 'icon-select-question-type',
        value: 'select_question_type',
        label: 'Select question type'
    },
    {
        icon: 'icon-form-textbox',
        value: 'textbox',
        label: 'Textbox'
    },
    {
        icon: 'icon-form-email',
        value: 'email',
        label: 'Email'
    },
    {
        icon: 'icon-form-url',
        value: 'url',
        label: 'Url'
    },
    {
        icon: 'icon-form-textarea',
        value: 'textarea',
        label: 'Textarea'
    },
    {
        icon: 'icon-form-checkboxes',
        value: 'checkboxes',
        label: 'Checkboxes'
    },
    {
        icon: 'icon-form-multi-select',
        value: 'multiselect',
        label: 'Multi Select'
    },
    {
        icon: 'icon-form-radio',
        value: 'radio',
        label: 'Radio'
    },
    {
        icon: 'icon-form-dropdown',
        value: 'dropdown',
        label: 'Dropdown'
    },
    {
        icon: 'icon-form-recaptcha',
        value: 'recapta',
        label: 'Recapta'
    },
    {
        icon: 'icon-form-attachment',
        value: 'attachment',
        label: 'Attachment'
    },
    {
        icon: 'icon-form-section',
        value: 'section',
        label: 'Section'
    },
    {
        icon: 'icon-form-store-description',
        value: 'datepicker',
        label: 'Date Picker'
    },
    {
        icon: 'icon-form-address01',
        value: 'timepicker',
        label: 'Time Picker'
    },
];


/**
 * Component that render form field type ( dropdown ) 
 */
const FormFieldSelect = ( props ) => {
    const { inputTypeList, formField, onChange } = props;

    // State variable for select type dropdown open or closed.
    const [ dropdownOpen, setDropdownOpen ] = useState( false );
    
    // Find selected input type.
    const selectedInputType = inputTypeList.find( ( inputType ) => inputType.value === formField.type );
    
    return (
        <div
            className=""
            onClick={(event) => {
                event.stopPropagation();
                setDropdownOpen( ! dropdownOpen );
            }}
        >
            {
                selectedInputType ?
                    (   
                        <div>
                            <i className={ `${ selectedInputType.icon }` } />
                            {<span>{ selectedInputType.label }</span>}
                        </div>
                        
                    ) : (
                        <div>
                            <i className={ `${ 'icon-select-question-type' }` } />
                            { <span>Select question type</span> }
                        </div>
                    )
            }

            {
                dropdownOpen &&
                inputTypeList.map(( inputType ) => (
                    <div
                        className={ `${ inputType.value ===  formField.type ? 'selected' : '' }` }
                        onClick={(event) => {
                            onChange?.( inputType.value );
                        }}
                    >
                        <i className={ `${ inputType.icon }` } />
                        { <span>{ inputType.label }</span> }
                    </div>
                ))
            }
        </div>
    );
}

/**
 * Component that render action section example ( remove, add new )
 */
const ActionIcon = (props) => {
    const { onDelete, onAddNew, onRequiredChange, formField } = props;
    const { hideRequired, hideDelete, hideAddNew } = props;

    return (
        <div className="action-icon">
            <div className={`required ${hideRequired ? 'disable': ''}`}>
                <input
                    type="checkbox"
                    checked={formField?.required}
                    onChange={(event) => onRequiredChange?.( event.target.checked )}
                />
            </div>
            <div
                className={`delete ${hideDelete ? 'disable' : ''}`}
                onClick={(event) => onDelete?.()}
            >
                Delete
            </div>
            <div 
                className={`addnew ${hideAddNew ? 'disable' : ''}`}
                onClick={(event) => onAddNew?.()}
            >
                AddNew
            </div>
        </div>
    );
}


// props value 
// 1. formTitlePlaceholder
// 2. formTitleDescription
// 3. formFieldTypes

const CustomFrom = (props) => {
    ////////////// Define state variable here /////////////////

    
    // Contain list of selected form fields.
    const [formFieldList, setFormFieldList] = useState(() => {
        // Form field list can't be empty it should contain atlest form title.
        // This action prevent any backend action for empty form field list.
        
        if (!Array.isArray(sampleArray) || sampleArray.length <= 0) {
            return [{
                id: 1,
                type: 'title',
                label: 'This is form editor',
                required: true,
            }];
        }

        return sampleArray;
    });

    // State for hold id of opend input section.
    const [opendInput, setOpendInput] = useState(null);

    // State variable for a random maximum id
    const [randMaxId, setRendMaxId] = useState();

    // Prepare random maximum id
    useEffect(() => {
        setRendMaxId(
            formFieldList.reduce((maxId, field) => Math.max(maxId, field.id), 0) + 1
        );
    }, [])

    ////////////// Define functionality here /////////////////
    
    /**
     * Function generate a empty form field and return it.
     */
    const getNewFormField = ( type ) => {
        const newFormField = {
            id: randMaxId,
            type: type,
            label: '',
            placeholder: '',
            description: '',
            required: false,
        };

        // update randMaxId by 1
        setRendMaxId( randMaxId + 1 );
        
        return newFormField;
    };

    /**
     * Function that append a new form field after a perticular index.
     * If form field list is empty it append at begining of form field list.
     */
    const appendNewFormField = (index) => {
        const newField = getNewFormField();

        // Create a new array with the new element inserted
        const newFormFieldList = [
            ...formFieldList.slice(0, index + 1),
            newField,
            ...formFieldList.slice(index + 1)
        ];
    
        // Update the state with the new array
        setFormFieldList(newFormFieldList);

        return newField;
    };

    /**
     * Function that delete a particular form field
     * @param {*} index 
     */
    const deleteParticularFormField = (index) => {
        // Create a new array without the element at the specified index
        const newFormFieldList = formFieldList.filter((_, i) => i !== index);

        // Update the state with the new array
        setFormFieldList(newFormFieldList);
    }

    /**
     * Function handle indivisual form field changes
     */
    const handleFormFieldChange = (index, key, value) => {
        // copy the form field before modify
        const newFormFieldList = [ ...formFieldList ]
        
        // Update the new form field list
        newFormFieldList[index] = {
            ...newFormFieldList[index],
            [key]: value
        }

        // Update the state variable
        setFormFieldList(newFormFieldList);
    }

    /**
     * Function that handle type change for a particular form field
     * @param {*} index 
     * @param {*} newType
     */
    const handleFormFieldTypeChange = (index, newType) => {
        console.log(index);
        // Get the input which one is selected
        const selectedFormField = formFieldList[index];
        
        // Check if selected type is previously selected type  
        if (selectedFormField.type == newType) { return }
        
        // Create a empty form field for that position
        const newFormField = getNewFormField(newType);
        
        // Copy some previously added data
        newFormField['label']       = selectedFormField['label'];
        newFormField['placeholder'] = selectedFormField['placeholder'];
        newFormField['description'] = selectedFormField['description'];
        newFormField['required']    = selectedFormField['required'];
        
        // Replace the newly created form field with old one
        const newFormFieldList  = [...formFieldList];
        newFormFieldList[index] = newFormField;

        setFormFieldList(newFormFieldList);
    }

    return (
        // Render Registration form here
        <div
            className=""
        >
            {/* Render form title here */}
            {
                <div
                    className=""
                    onClick={(event) => {
                        event.stopPropagation();
                        setOpendInput(formFieldList[0]);
                    }}
                >
                    <div className="">
                        <input
                            className=""
                            type="text"
                            placeholder={ props.formTitlePlaceholder }
                            value={ formFieldList[ 0 ]?.label }
                            onChange={ ( event ) => { handleFormFieldChange( 0, 'label', event.target.value ) } }
                        />
                        <div className="mvx-registration-form-description">
                            { props.formTitleDescription }
                        </div>
                    </div>
                    <ActionIcon
                        hideRequired={true}
                        hideDelete={true}
                        onAddNew={() => {
                            const newInput = appendNewFormField(0);
                            setOpendInput(newInput);
                        }}
                    />
                </div>
            }

            {/* Render form fields here */}
            {
                <ReactSortable
                    list={formFieldList}
                    setList={(newList) => { setFormFieldList(newList)}}
                    handle=".drag-handle"
                >
                    {
                        formFieldList.length > 0 &&
                        formFieldList.map((formField, index) => {
                            
                            if ( index === 0 ) { return <div style={{display: 'none'}}></div> }
                            
                            return (
                                <div style={{ marginTop: '20px' }}>

                                    {/* Render grab icon for drag and drop */}
                                    <span className="drag-handle" style={{  cursor: 'grab' }}>
                                        <FaArrowsAlt />
                                    </span>

                                    {/* Render main content */}
                                    <div
                                        className={opendInput?.id != formField.id ? 'hidden-list' : ''}
                                        onClick={(event) => { setOpendInput(formField) }}
                                    >
                                        {/* Render question name here */}
                                        <div className="" style={{ 'border': '1px solid black' }}>
                                            {
                                                (
                                                    formField.type == 'textbox' ||
                                                    formField.type == 'email' ||
                                                    formField.type == 'url'
                                                ) &&
                                                <Template.SimpleInput
                                                    formField={formField}
                                                    onChange={(key, value) => { console.log(key, value) }}
                                                />
                                            }
                                            {
                                                (
                                                    formField.type == 'checkboxes' ||
                                                    formField.type == 'multiselect' ||
                                                    formField.type == 'radio' ||
                                                    formField.type == 'dropdown'
                                                ) &&
                                                <Template.MultipleOptions
                                                    formField={formField}
                                                    onChange={(key, value) => { console.log(key, value) }}
                                                />
                                            }
                                            {
                                                formField.type == 'textarea' &&
                                                <Template.Textarea
                                                    formField={formField}
                                                    onChange={(key, value) => { console.log(key, value) }}
                                                />
                                            }
                                            {
                                                formField.type == 'datepicker' &&
                                                <div> Date Picker </div>
                                            }
                                            {
                                                formField.type == 'attachment' &&
                                                <div> Attachment </div>
                                            }
                                            {
                                                formField.type == 'recapta' &&
                                                <div> Recapta </div>
                                            }
                                            {
                                                formField.type == 'datepicker' &&
                                                <div> Date Picker </div>
                                            }
                                            {
                                                formField.type == 'section' &&
                                                <div> Section </div>
                                            }
                                        </div>
                                    </div>

                                    {/* Render type-select section here */}
                                    {
                                        opendInput?.id == formField.id &&
                                        <FormFieldSelect
                                            inputTypeList={selectOptions}
                                            formField={formField}
                                            onChange={(inputType) => { handleFormFieldTypeChange(index, inputType) }}
                                        />
                                    }

                                    {/* Render action icon */}
                                    <ActionIcon
                                        formField={formField}
                                        onAddNew={() => {
                                            const newInput = appendNewFormField(index);
                                            setOpendInput(newInput);
                                        }}
                                        onDelete={() => {
                                            deleteParticularFormField(index);
                                            setOpendInput(null);
                                        }}
                                        onRequiredChange={(required) => {
                                            console.log(required);
                                            handleFormFieldChange(index, 'required', required);
                                        }}
                                    />
                                </div>
                            )
                        })
                    }
                </ReactSortable>
            }
        </div>
    );
}

export default CustomFrom;