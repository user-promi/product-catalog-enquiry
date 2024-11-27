import React, { useState, useEffect, useRef } from 'react';
import './SubTabSection.scss';
import { Link } from 'react-router-dom';

const SubTabSection = (props) => {
    const { menuitem, currentTab, setCurrentTab } = props;

    const [menuOpen, setMenuOpen] = useState(false);

    const [settings, setSettings] = useState(props.setting);

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
                        <i className={`admin-font ${menu.icon}`}></i>
                        {menu.name}
                    </div>
                ))}
            </div>
        </>
    );
}

export default SubTabSection;
