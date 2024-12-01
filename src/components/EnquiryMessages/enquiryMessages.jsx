import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EnquiryDetails from './enquiryDetails.jsx';
import "./enquiryMessages.scss";
import Logo from '../../assets/images/Brand.png';
import { useModules } from '../../contexts/ModuleContext.jsx';
import Dialog from "@mui/material/Dialog";
import Popoup from "../PopupContent/PopupContent";
import Modulepopup from "../PopupContent/ModulePopup";

const EnquiryMessages = (props) => {

    // Check pro is active and module is active or not.
    const { modules } = useModules();
    // if ( ! modules.includes( 'enquiry' ) || ! appLocalizer.pro_active ) {
    //     return (
    //         <div class="enquiry-img"></div>
    //     ); 
    // }

    const [enquiryLists, setEnquiryLists] = useState([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [filterValue, SetFilterValue] = useState('');
    const [starMsgOpen, SetStarMsgOpen] = useState(false);
    const [starMsgList, setStarMsgList] = useState([]);
    const [textBtnOpen, settextBtnOpen] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const closePopup = ()  => {
			SetStarMsgOpen(false);
            settextBtnOpen(null);
        } 
		document.body.addEventListener("click", closePopup)
        return () => {
            document.body.removeEventListener("click", closePopup )
        }
	}, []);

    const fetchStarredMessages = () => {
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/get-star-msg-list`,
        }).then((response) => {
            setStarMsgList(response.data);
        }).catch((error) => {
            console.error("Error fetching starred messages:", error);
        });
    };

    
    useEffect(() => {
        if (appLocalizer.pro_active) {
            axios({
                method: "post",
                url: `${appLocalizer.apiurl}/catalog/v1/get-enquiry-list`,
            }).then((response) => {
                setEnquiryLists(response.data);
            });
        }
    }, []);

    useEffect(() => {
        fetchStarredMessages();
    }, []);

    const handleEnquiryClick = (enquiry) => {
        setSelectedEnquiry(enquiry);
    };

    const handleSearch = (e) => {
        SetFilterValue(e.target.value)

    };

    const handletextBtnOpen = (e, index) => {
        e.stopPropagation();
        if (textBtnOpen === index) {
            settextBtnOpen(null);
        }
        else {
            settextBtnOpen(index);
        }
    };

    const handleCopyMsg = (msg) => {
        const cleanedMsg = msg
            .replace(/<\/?strong>/g, '') 
            .replace(/<br\s*\/?>/gi, '\n');
        
        navigator.clipboard.writeText(cleanedMsg);
    }

    const handleStarMsg = (id) => {
        console.log(id)
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/save-reaction`,
            data: {
                msgId: id,
                action: 'remove'
            },
        }).then((response) => {
            fetchStarredMessages();
        });
    }
    

    const productContain = (productList, filter) => {
        return productList.find((product) => {
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

            if (productContain(enquiryList.product_info, filterValue)) {
                return true;
            }

            return false;
        });
        // return [...enquiryLists];
    };

    return (
        <>
        {!appLocalizer.pro_active ? (
            <>
                <Dialog
                    className="admin-module-popup"
                    open={openDialog}
                    onClose={() => {
                        setOpenDialog(false);
                    }}
                    aria-labelledby="form-dialog-title"
                >
                    <span
                        className="admin-font adminLib-cross"
                        onClick={() => {
                            setOpenDialog(false);
                        }}
                    ></span>
                    <Popoup />
                </Dialog>
                <div
                    className="enquiry-img"
                    onClick={() => {
                        setOpenDialog(true);
                    }}>
                </div>
            </>
        ) : !modules.includes('enquiry') ? (
            <>
                <Dialog
                    className="admin-module-popup"
                    open={openDialog}
                    onClose={() => {
                        setOpenDialog(false);
                    }}
                    aria-labelledby="form-dialog-title"
                >
                    <span
                        className="admin-font adminLib-cross stock-manager-popup-cross"
                        onClick={() => {
                            setOpenDialog(false);
                        }}
                    ></span>
                    <Modulepopup name='enquiry' />
                </Dialog>
                <div
                    className="enquiry-img"
                    onClick={() => {
                        setOpenDialog(true);
                    }}>
                </div>
            </>
          ) : (
            <div className="container">
                <div className="chat-list">
                    <div className="header">
                        <div className="header-container">
                            <nav className='header-container-wrapper'>
                                <div className="header-heading">
                                    <h1>CatalogX</h1>
                                    <span className="total-message">({enquiryLists.length})</span>
                                </div>
                                <span className='starter-message'>
                                    <i className='admin-font adminLib-more-vertical' onClick={(e) => {
                                        e.stopPropagation();
                                        SetStarMsgOpen(true);
                                    }}></i>
                                </span>
                                {starMsgOpen && 
                                    <main className='starter-container-wrapper'>
                                        <ul>
                                            {starMsgList && starMsgList.map((message, index) => (
                                                <li key={index}>
                                                    <article>
                                                        <div className="sender-img">
                                                            <img src="https://shorturl.at/gGILQ" alt="Sender" />
                                                        </div>
                                                        <main className="chat-content-wrapper">
                                                            <section>
                                                                <div>
                                                                    <p dangerouslySetInnerHTML={{ __html: message.msg }} />
                                                                </div>
                                                                <nav>
                                                                    <button onClick={(e) => handletextBtnOpen(e, index)}>
                                                                        <i className="admin-font adminLib-more-vertical"></i>
                                                                    </button>
                                                                    {textBtnOpen === index &&
                                                                        <div className="chat-text-control-wrapper">
                                                                            {console.log(message)}
                                                                            <button onClick={() => handleCopyMsg(message.msg)} >Copy</button>
                                                                            <button onClick={() => handleStarMsg(message.id)} >Remove star</button>
                                                                        </div>
                                                                    }
                                                                </nav>
                                                            </section>
                                                            <footer>
                                                                {message.date}
                                                            </footer>
                                                        </main>
                                                    </article>
                                                </li>
                                            ))}
                                        </ul>
                                    </main>
                                }
                            </nav>
                            <div className="search-option">
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={(e) => handleSearch(e)}
                                />
                                <button className="search-btn">
                                    <i className="admin-font adminLib-search" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="chat-list-container">
                        <h5 className="recent-message">Recent Message</h5>
                        <div className="chat-container-wrapper">
                            <ul>
                                {getFilterEnquiryList().length === 0 && 
                                    <li>
                                        <div className="chat-item active no-data-section">
                                            <div className="chat-item-container">
                                                <p>No enquiry found</p>
                                            </div>
                                        </div>
                                    </li>
                                }
                                {getFilterEnquiryList().map((enquiry, index) => (
                                    <li>
                                        <button className="chat-item active" onClick={() => handleEnquiryClick(enquiry)}>
                                            <div className="chat-item-container">
                                                <div className="chat-img">
                                                    <img src={enquiry.image} alt="https://shorturl.at/gGILQ" />
                                                </div>
                                                <div className="chat-meta">
                                                    <p className="enquiry-id">#{enquiry.id}</p>
                                                    <p>
                                                        {enquiry.product_info.map((product, index) => (
                                                            `${product.name} (SKU - ${product.sku})${index !== enquiry.product_info.length - 1 ? ', ' : ''}`
                                                        ))}
                                                    </p>
                                                    <p>{enquiry.name}</p>
                                                </div>
                                                {/* <div className="pending-count">
                                                    <span>18</span>
                                                </div> */}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {selectedEnquiry ?
                    <EnquiryDetails enquiry={selectedEnquiry} />
                    :
                    <main className='chatting-container no-data-section'>
                        <img src={Logo} alt="logo" />
                        <h1>Catalog Enquiry Message</h1>
                        <p>Your Enquiry Command Center: Manage and respond to all inquiries, attach files, tag users/products, pin important messages, and create quotations seamlessly from one centralized enquiry box.</p>
                    </main>
                }
            </div>
        )}
        </>
    );
}

export default EnquiryMessages;