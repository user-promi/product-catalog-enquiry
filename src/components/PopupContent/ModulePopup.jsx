/* global appLocalizer */
import React, { Component } from 'react';
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import './popupContent.scss';

const Modulepopup = (props) => {
    return (
        <>
            <DialogContent>
                <DialogContentText>
                    <div className="admin-module-dialog-content">
                        <div className="admin-image-overlay">
                            <div className="admin-overlay-content">
                                <h1 className="banner-header">Unlock <span className="banner-pro-tag">Pro</span> </h1>
                                <div className="admin-banner-content">
                                    <strong>{props.name}</strong>
                                    <p>&nbsp;</p>
                                    <p>1. Double Opt-in.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContentText>
            </DialogContent>
        </>
    );
}

export default Modulepopup;