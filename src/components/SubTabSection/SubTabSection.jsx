import React, { useState, useEffect, useRef } from 'react';
import './SubTabSection.scss';
import { Link } from 'react-router-dom';

const SubTabSection = (props) => {
    const { menuitem, currentTab, setCurrentTab } = props;

    const [menuOpen, setMenuOpen] = useState(false);

    const [settings, setSettings] = useState(props.setting);

    const buttonRef = useRef();

    // useEffect(() => {
    //     if (menuOpen) {
    //     document.body.addEventListener("click", (event) => {
    //         console.log("body")
    //         if (!buttonRef?.current?.contains(event.target)) {
    //             console.log("hello")
    //             setMenuOpen(false);
    //         }
    //     })
    //     }
    // }, [])


    return (
        <>
            {/* Render menu items */}
            <div className='tab-section'>
                {menuitem.map((menu, index) => (
                    <div
                        key={index}
                        className={`tab-section-menu ${ menu.id === currentTab.id ? 'active' : '' }`}
                        onClick={(e) => {
                            setCurrentTab(menu)
                        }}
                    >
                        <span><i className={`admin-font ${menu.icon}`}></i></span>
                        {menu.name}
                    </div>
                ))}
            </div>

            {/* Render meta menu */}
            <div
                // ref={buttonRef}
                className={`tab-menu-setting-section ${menuOpen ? 'active' : ''}`}
                onClick={(e) => {
                    setMenuOpen(true);
                }}
            >
                {
                    menuOpen ?
                        <div className='tab-menu-setting-wrapper'>
                            <p className='tab-heading'>{currentTab.name}</p>
                            <div className='setting-wrapper-section'>
                                {currentTab.setting?.map((setting, index) => {
                                    return (
                                        <div className='tab-menu-setting-item' key={index}>
                                            <p className='setting-title'>{setting.name} <i title={setting.description} className='admin-font font-info'></i></p>
                                            <div className='toggle-checkbox-content'>
                                                <input
                                                    type='checkbox'
                                                    checked={settings[setting.id]}
                                                    id={setting.id}
                                                    onChange={(e) => {
                                                        setSettings(() => {
                                                            return { ...settings, [setting.id]: e.target.checked };
                                                        })
                                                        props.onChange(setting.id, e.target.checked);
                                                    }}
                                                />
                                                <label htmlFor={setting.id}></label>
                                                {/* <input
                                                    type="checkbox"
                                                    name={setting.id}
                                                    // checked={props.setting[setting.id]}
                                                    id={setting.id}
                                                    onChange={(e) => {
                                                        console.log("helloooo");
                                                        // e.preventDefault();
                                                        // props.onChange(setting.id, e.target.checked);
                                                    }}
                                                />
                                                <label htmlFor={setting.id} onClick={(e) => {
                                                    console.log("Hiiiii");
                                                }}></label> */}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <Link to={''} className='advanced-setting-btn'>Advanced settings</Link>
                        </div>
                        :
                        <i className={`tab-slide-btn admin-font ${currentTab.icon}`}></i>
                }
            </div>
        </>
    );
}

export default SubTabSection;
