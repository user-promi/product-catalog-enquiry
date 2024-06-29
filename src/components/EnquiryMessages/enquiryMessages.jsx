import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnquiryDetails from './enquiryDetails.jsx';
import "./enquiryMessages.scss";

const EnquiryMessages = (props) => {
    const [enquiryLists, setEnquiryLists] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [filterValue, SetFilterValue] = useState('');

    useEffect(() => {
        axios({
            method: "post",
            url: `${appLocalizer.apiUrl}/catalog/v1/get-enquiry-list`,
        }).then((response) => {
            setEnquiryLists(response.data);
        });
    }, []);

    const handleEnquiryClick = (enquiry) => {
        setSelectedEnquiry(enquiry);
    };

    const handleSearch = (e) => {
        SetFilterValue(e.target.value)

    };

    const productContain = (productList, filter) => {
        return productList.find((product) => {
            console.log(product)
            if (product.name.includes(filterValue)) {
                return true;
            }

            if (product.sku.includes(filterValue)) {
                return true;
            }
            return false;
        });
    };

    const getFilterEnquiryList = () => {
        if (!filterValue) {
            return enquiryLists;
        }

        return enquiryLists.filter((enquiryList) => {
            if (enquiryList.id == filterValue) {
                return true
            }

            if (enquiryList.name == filterValue) {
                return true
            }

            if (productContain(enquiryList.product, filterValue)) {
                return true;
            }

            return false;
        });
        // return [...enquiryLists];
    };

    console.log(enquiryLists)

    return (
        <div className="container">
            <div className="chat-list">
                <div className="header">
                    <div className="header-container">
                        <div className="header-heading">
                            <h1>MultivendorX</h1>
                            <span className="total-message">({enquiryLists.length})</span>
                        </div>
                        <div className="search-option">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search here..."
                                onChange={(e) => handleSearch(e)}
                            />
                            <button className="search-btn">
                                <i className="admin-font font-search" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="chat-list-container">
                    <h5 className="recent-message">Recent Message</h5>
                    <div className="chat-container-wrapper">
                        <ul>
                            {getFilterEnquiryList().map((enquiry, index) => (
                                <li>
                                    <button className="chat-item active" onClick={() => handleEnquiryClick(enquiry)}>
                                        <div className="chat-item-container">
                                            <div className="chat-img">
                                                <img src="https://shorturl.at/gGILQ" alt="" />
                                            </div>
                                            <div className="chat-meta">
                                                <p className="enquiry-id">#{enquiry.id}</p>
                                                <p>
                                                    {enquiry.product.map((product, index) => (
                                                        `${product.name} (SKU - ${product.sku})${index !== enquiry.product.length - 1 ? ', ' : ''}`
                                                    ))}
                                                </p>
                                                <p>{enquiry.name}</p>
                                            </div>
                                            <div className="pending-count">
                                                <span>18</span>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {selectedEnquiry && <EnquiryDetails enquiry={selectedEnquiry} />}
        </div>
    );
}

export default EnquiryMessages;