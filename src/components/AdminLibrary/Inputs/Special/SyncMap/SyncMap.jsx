import { useEffect, useRef, useState } from "react";
import './SyncMap.scss';

const SyncMap = (props) => {
    const { value = [], onChange, proSetting, proSettingChanged, description, syncFieldsMap } = props;

    // Extract the systems (e.g., WordPress, Moodle) dynamically from syncFieldsMap
    const systems = Object.keys(syncFieldsMap);
    // Ensure value is an array of arrays (pairs of selected fields)
    const formattedValue = Array.isArray(value) && value.every(Array.isArray) ? value : [];
    const [selectedFields, setSelectedFields] = useState(formattedValue);
    const [availableFields, setAvailableFields] = useState({});
    const [btnAllow, setBtnAllow] = useState(false);
    const settingChanged = useRef(false);
    // Generate available fields for each system

    useEffect(() => {
        const updatedAvailableFields = {};

        systems.forEach((system) => {
            updatedAvailableFields[system] = Object.keys(syncFieldsMap[system].fields).filter(field =>
               !selectedFields.some(([selectedFieldA, selectedFieldB]) => selectedFieldA === field || selectedFieldB === field)
            );
        });

        setAvailableFields(updatedAvailableFields);
    }, [selectedFields, syncFieldsMap, systems]);

    // Handle field selection changes
    const changeSelectedFields = (fieldIndex, value, systemIndex) => {
        setSelectedFields(prevFields =>
            prevFields.map((fieldPair, index) => {
                if (index === fieldIndex) {
                    const newPair = [...fieldPair];
                    newPair[systemIndex] = value;
                    return newPair;
                }
                return fieldPair;
            })
        );
    };

    // Remove selected field mapping
    const removeSelectedFields = (fieldIndex) => {
        setSelectedFields(prevFields => prevFields.filter((_, index) => index !== fieldIndex));
        setBtnAllow(false);
    };

    // Insert new selected fields dynamically
    const insertSelectedFields = () => {
        if (availableFields[systems[0]].length && availableFields[systems[1]].length) {
            const systemAField = availableFields[systems[0]].shift();
            const systemBField = availableFields[systems[1]].shift();

            setSelectedFields(prevFields => [...prevFields, [systemAField, systemBField]]);
            setBtnAllow(availableFields[systems[0]].length === 0 && availableFields[systems[1]].length === 0);
        } else {
            alert('Unable to add sync fields');
        }
    };

    // Trigger onChange when selectedFields changes
    useEffect(() => {
        if (settingChanged.current) {
            settingChanged.current = false;
            onChange(selectedFields);
        }
    }, [selectedFields, onChange]);

    return (
        <div className="sync-map-container">
            <div className="container-wrapper">
                <div className="main-wrapper">
                    <div className="main-wrapper-heading">
                        <span>{syncFieldsMap[systems[0]].heading}</span>
                        <span>{syncFieldsMap[systems[1]].heading}</span>
                    </div>
                    {/* Static email mapping */}
                    <div className="map-content-wrapper">
                        <select className="" disabled>
                            <option value="email">Email</option>
                        </select>
                        <span className="connection-icon">⇌</span>
                        <select className="" disabled>
                            <option value="email">Email</option>
                        </select>
                    </div>
                    {/* Dynamic field mappings */}
                    {selectedFields && 
                        selectedFields.map(([systemAField, systemBField], index) => (
                            <div className="map-content-wrapper" key={index}>
                                {/* System A select */}
                                <select
                                    className=""
                                    value={systemAField}
                                    onChange={(e) => {
                                        if (!proSettingChanged()) {
                                            settingChanged.current = true;
                                            changeSelectedFields(index, e.target.value, 0);
                                        }
                                    }}
                                >
                                    <option value={systemAField}>{syncFieldsMap[systems[0]].fields[systemAField]}</option>
                                    {availableFields[systems[0]]?.map(option => (
                                        <option key={option} value={option}>
                                            {syncFieldsMap[systems[0]].fields[option]}
                                        </option>
                                    ))}
                                </select>
                                <span className="connection-icon">&#8652;</span>
                                {/* System B select */}
                                <select
                                    className=""
                                    value={systemBField}
                                    onChange={(e) => {
                                        if (!proSettingChanged()) {
                                            settingChanged.current = true;
                                            changeSelectedFields(index, e.target.value, 1);
                                        }
                                    }}
                                >
                                    <option value={systemBField}>{syncFieldsMap[systems[1]].fields[systemBField]}</option>
                                    {availableFields[systems[1]]?.map(option => (
                                        <option key={option} value={option}>
                                            {syncFieldsMap[systems[1]].fields[option]}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="remove-mapping"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!proSettingChanged()) {
                                            settingChanged.current = true;
                                            removeSelectedFields(index);
                                        }
                                    }}
                                >
                                    <span className="text">Clear</span>
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        ))
                    }
                </div>
                {/* Add new mapping button */}
                <div className="btn-container">
                    <div className="add-mapping-container">
                        <button
                            className={`btn-purple add-mapping ${btnAllow ? "not-allow" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (!proSettingChanged()) {
                                    settingChanged.current = true;
                                    insertSelectedFields();
                                }
                            }}
                        >
                            <span className="text">Add</span>
                            <span className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                                </svg>
                            </span>
                        </button>
                        {proSetting && <span className="admin-pro-tag">pro</span>}
                    </div>
                </div>
            </div>
            {description && <p className="settings-metabox-description" dangerouslySetInnerHTML={{ __html: description }}></p>}
        </div>
    );
};

export default SyncMap;