import React, { useState, useEffect, useRef } from 'react';
import Profile from './MessageComponents/Profile';
import CartComponents from './MessageComponents/CartComponents';
import EnquiryControlsBtn from './MessageComponents/EnquiryControlsBtn';
import "./enquiryMessages.scss";

const EnquiryNavbar = (props) => {
    const { enquiry } = props;
    const [showProfile, setShowProfile] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showControlsBtn, setShowControlsBtn] = useState(false);

    const handleShowControlsBtn = () => {
        setShowCart(false);
        setShowProfile(false);
        setShowControlsBtn(!showControlsBtn);
    };

    const handleCart = () => {
        setShowControlsBtn(false);
        setShowProfile(false);
        setShowCart(!showCart);
    };

    const handleProfile = () => {
        setShowCart(false);
        setShowControlsBtn(false);
        setShowProfile(!showProfile);
    };

    return (
        <>
            <div className="header">
                <div className="chat-meta">
                    <div className="back-btn">
                        <i className="admin-font adminLib-arrow-left" />
                    </div>
                    <button onClick={handleProfile} className="chat-meta-data">
                        <div className="chat-img">
                            <img src={enquiry.image} alt="https://shorturl.at/gGILQ"  />
                        </div>
                        <div className="chat-meta">
                            <p className="enquery-id">#{enquiry.id}</p>
                            <p>{enquiry.name}</p>
                        </div>
                    </button>
                </div>
                <div className="chat-more-option">
                    <ul>
                        <li className="chat-more-option-item">
                            <div class="input-container">
                                <input placeholder="Search..." class="input" type="text" onChange={(e) => { props.onChange?.(e) }} />
                                <i className="admin-font icon adminLib-search" />
                            </div>
                        </li>
                        <li className="chat-more-option-item">
                            <button onClick={handleProfile} className="chat-more-option-button">
                                <i className="admin-font adminLib-info" />
                            </button>
                        </li>
                        <li className="chat-more-option-item">
                            <button onClick={handleCart} className="chat-more-option-button">
                                <i className="admin-font adminLib-cart" />
                            </button>
                            {showCart && <CartComponents showCart={showCart} handleCart={handleCart} enquiry={enquiry} />}
                        </li>
                        <li className="chat-more-option-item">
                            <button onClick={handleShowControlsBtn} className="chat-more-option-button">
                                <i className="admin-font adminLib-more-vertical" />
                            </button>
                            {showControlsBtn && <EnquiryControlsBtn enquiry={enquiry} />}
                        </li>
                    </ul>
                </div>
            </div>
            {showProfile && <Profile showProfile={showProfile} handleProfile={handleProfile} enquiry={enquiry} />}
        </>
    );
}

export default EnquiryNavbar;