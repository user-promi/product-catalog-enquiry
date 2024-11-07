import React, { useState, useEffect } from 'react';
import { __ } from "@wordpress/i18n";


const ViewPopup = (props) => {
    const {addiionalFields, setOpenDialog} = props;

    return (
        <>
            <main className='view-wholesale-wrapper'>
                <h1 className='popup-heading'>View Form</h1>
                {
                    Object.entries(addiionalFields).map(([key, value], index)=>{
                        return(
                            <div key={index} className='popup-content-wrapper'>
                                <label>{key}:</label>
                                <input 
                                    type="text"
                                    value={value}
                                    readOnly
                                />
                            </div>
                        )
                    })
                }
                {console.log(addiionalFields)}
                {
                    !addiionalFields && <p className='empty-form'>No Data Found</p>
                }
                <div className='popup-content-wrapper right-alignment'>
                    <button className='modal-close' onClick={()=> setOpenDialog(false)}>Close</button>
                </div>
            </main> 
        </>
    )
}
export default ViewPopup