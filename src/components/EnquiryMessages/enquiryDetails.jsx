import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./enquiryMessages.scss";
import EnquiryNavbar from './enquiryNavbar.jsx';
import EnquirySubmit from './enquirySubmit.jsx';
import EmojiPicker from 'emoji-picker-react';


const FileDisplay = ({ fileUrl, fileType }) => {
    const renderFile = () => { ""
        if (fileType.includes('image')) {
            return <img src={fileUrl} alt="file" style={{ maxWidth: '100%' }} />;
        }
        switch (fileType) {
            case 'application':
            case 'application/pdf':
            return (
                <iframe
                src={fileUrl}
                style={{ width: '100%', height: '250px' }}
                frameBorder="0"
                />
            );
            case 'text':
            return (
                <iframe
                src={fileUrl}
                style={{ width: '100%', height: '250px' }}
                frameBorder="0"
                />
            );
            default:
            return <p>{console.log(fileType)}Unsupported file type</p>;
      }
    };
  
    return <div>{renderFile()}</div>;
};

const EnquiryDetails = (props) => {
    const { enquiry, onDelete } = props;
    const [enquiryDetails, setEnquiryDetails] = useState(null);
    const [searchValue, SetSearchValue] = useState('');
    const scrollDiv = useRef(null);
    const [message, setMessage] = useState('');
    const [SelectEmoji, setSelectEmoji] = useState(null);
    const [reactionOpen, setReactionOpen] = useState(null);
    const [chatTextBtnOpen, setChatTextBtnOpen] = useState(null);
    const [reply, setReply] = useState(null);
    const [pinMsg, setPinMsg] = useState('');

    useEffect(() => {
        const closePopup = ()  => {
			setChatTextBtnOpen(null);
            setReactionOpen(null);
        } 
		document.body.addEventListener("click", closePopup)
        return () => {
            document.body.removeEventListener("click", closePopup )
        }
	}, [])

    useEffect(() => {
        if ( ! enquiryDetails ) return;
        const foundDetail = enquiryDetails.find((enquiryDetail) => enquiryDetail.id === enquiry.pin_msg_id);
        setPinMsg(foundDetail ? foundDetail.msg : '');
    }, [enquiryDetails])

    useEffect(() => {
        if (enquiry) {
            setEnquiryDetails(null);
            fetchData();
        }
    }, [enquiry]);

    const fetchData = () => {
        try {
            axios({
                method: "post",
                url: `${appLocalizer.apiurl}/catalog/v1/get-messages-list`,
                data: { enquiry: enquiry },
            }).then((response) => {
                setEnquiryDetails(response.data);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }; 

    const handleReactionOpen = (e, index) => {
        e.stopPropagation();
        if (reactionOpen === index) {
            setReactionOpen(null);
        }
        else {
            setReactionOpen(index);
        }
        setChatTextBtnOpen(null);
    };

    const handleChatTextBtnOpen = (e, index) => {
        e.stopPropagation();
        if (chatTextBtnOpen === index) {
            setChatTextBtnOpen(null);
        }
        else {
            setChatTextBtnOpen(index);
        }
        setReactionOpen(null);
    };

    const handleReplyOnThis = (id, msg) => {
        if (msg) {
            setReply(msg);
        }
    };

    const handlePinMsg = (enquiryId, id) => {
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/save-pin-msg`,
            data: {
                enquiryId : enquiryId,
                msgId : id,
            },
        }).then((response) => {
            setPinMsg(response.data.chat_message)
        });
    }

    const handlePinMsgDelete = (enquiryId) => {
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/save-pin-msg`,
            data: {
                action: 'delete',
                enquiryId : enquiryId,
            },
        }).then((response) => {
            if (response.data) 
                setPinMsg('')
        });
    }

    const onReactionClick = (id, emojiObject, event) => {
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/save-reaction`,
            data: {
                msgId: id,
                emoji: emojiObject.emoji,
            },
        }).then((response) => {
            fetchData();
            setSelectEmoji(emojiObject.emoji);
            setReactionOpen(null);
        });
    }

    const handleMsgSearch = (e) => {
        SetSearchValue(e.target.value);
    }

    const handleDeleteThisMsg = (id, msg) => {
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/delete-msg`,
            data: {
                msgId: id,
                msg: msg,
            },
        }).then((response) => {
            fetchData();
        });

    };

    const handleCopyMsg = (msg) => {
        navigator.clipboard.writeText(msg);
    }

    const handleStarMsg = (id) => {
        axios({
            method: "post",
            url: `${appLocalizer.apiurl}/catalog/v1/save-reaction`,
            data: {
                msgId: id,
            },
        }).then((response) => {
            fetchData();
        });
    }

    const getFilterEnquiryDetails = () => {
        if (!searchValue) {
            return enquiryDetails;
        }

        return enquiryDetails.filter((enquiryDetail) => {
            if (enquiryDetail.msg.includes(searchValue)) {
                return true;
            }
            return false;
        });
    };

    return (
        <>
            <div className="chatting-container">
                <div className="chat-wrapper">
                    <EnquiryNavbar enquiry={enquiry} onChange={(e) => handleMsgSearch(e)} />
                    {
                        enquiryDetails ?
                            <>
                                <div className="chatting-main-container" ref={scrollDiv} >
                                    {pinMsg && 
                                        <header className='pin-message-section'>
                                            <p dangerouslySetInnerHTML={{ __html: pinMsg }} />
                                            <button onClick={() => handlePinMsgDelete(enquiry.id)}>
                                                <i className='admin-font adminLib-cross'></i>
                                            </button>
                                        </header>
                                    }
                                    
                                    <ul className="wrapper" >
                                        {getFilterEnquiryDetails().map((enquiryDetail, index) => (
                                            <>
                                                {enquiryDetail.admin_msg ? (
                                                    <li key={index} className="send message-box">
                                                        <div className="message-box-wrapper">
                                                            <div className="sender-img">
                                                                <img src={enquiry.image} alt="https://shorturl.at/gGILQ" />
                                                            </div>
                                                            <div className="chat-content-wrapper">
                                                                <div className="chat-content">
                                                                    {
                                                                        enquiryDetail.attachment &&
                                                                        <div style={{'width': '100px', 'height': '100px'}}>
                                                                            <a target='_blank' href={enquiryDetail.attachment}>
                                                                                <FileDisplay fileUrl={ enquiryDetail.attachment } fileType={enquiryDetail.attachment_type} />
                                                                            </a>
                                                                        </div>
                                                                    }
                                                                    <div className="content">
                                                                        <div dangerouslySetInnerHTML={{ __html: enquiryDetail.msg }} />
                                                                        <div className="status">
                                                                            <i className="admin-font adminLib-check" />
                                                                        </div>
                                                                        {enquiryDetail.reaction !== null &&
                                                                            <button className='reaction-view'>
                                                                                {enquiryDetail.reaction}
                                                                            </button>
                                                                        }
                                                                    </div>
                                                                    <div className={`${(reactionOpen === index || chatTextBtnOpen === index) ? 'active' : ''} section-reaction`}>
                                                                        {reactionOpen === index &&
                                                                            <div className='reaction-wrapper'>
                                                                                <EmojiPicker allowExpandReactions={false} reactionsDefaultOpen={true} onEmojiClick={(event, emojiObject) => onReactionClick(enquiryDetail.id, event, emojiObject)} />
                                                                            </div>
                                                                        }
                                                                        {chatTextBtnOpen === index &&
                                                                            <div className='chat-text-control-wrapper'>
                                                                                <button onClick={() => handleReplyOnThis(enquiryDetail.id, enquiryDetail.msg)}>Reply on this</button>
                                                                                <button onClick={() => handleCopyMsg(enquiryDetail.msg)} > Copy </button>
                                                                                <button onClick={() => handlePinMsg(enquiry.id, enquiryDetail.id)} >Pin to top</button>
                                                                                <button onClick={() => handleStarMsg(enquiryDetail.id)} >Add to star</button>
                                                                                <button className='delete-message-btn' onClick={() => handleDeleteThisMsg(enquiryDetail.id, enquiryDetail.msg)}>Delete</button>
                                                                            </div>
                                                                        }
                                                                        <button onClick={(e) => handleReactionOpen(e, index)}>
                                                                            <i className="admin-font adminLib-smile-o" />
                                                                        </button>
                                                                        <button onClick={(e) => handleChatTextBtnOpen(e, index)}>
                                                                            <i className="admin-font adminLib-more-vertical" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="chat-time">{enquiryDetail.date}</div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ) : (
                                                    <li key={index} className="receive message-box">
                                                        <div className="message-box-wrapper">
                                                            <div className="chat-content-wrapper">
                                                                <div className="chat-content">
                                                                        <div className="content">
                                                                        {
                                                                            enquiryDetail.attachment &&
                                                                            <div className='attachment-content-wrapper'>
                                                                                <a target='_blank' href={enquiryDetail.attachment}>
                                                                                    <FileDisplay fileUrl={ enquiryDetail.attachment } fileType={enquiryDetail.attachment_type} />
                                                                                </a>
                                                                            </div>
                                                                        }
                                                                        <div dangerouslySetInnerHTML={{ __html: enquiryDetail.msg }} />
                                                                        <div className="status">
                                                                            <i className="admin-font adminLib-check" />
                                                                        </div>
                                                                        {enquiryDetail.reaction !== null && (
                                                                            <button className='reaction-view'>
                                                                                {enquiryDetail.reaction}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className={`${(reactionOpen === index || chatTextBtnOpen === index) ? 'active' : ''} section-reaction`}>
                                                                        {reactionOpen === index &&
                                                                            <div className='reaction-wrapper'>
                                                                                <EmojiPicker allowExpandReactions={false} reactionsDefaultOpen={true} onEmojiClick={(event, emojiObject) => onReactionClick(enquiryDetail.id, event, emojiObject)} />
                                                                            </div>
                                                                        }
                                                                        {chatTextBtnOpen === index &&
                                                                            <div className='chat-text-control-wrapper'>
                                                                                <button onClick={() => handleReplyOnThis(enquiryDetail.id, enquiryDetail.msg)}>Reply on this</button>
                                                                                <button onClick={() => handleCopyMsg(enquiryDetail.msg)} >Copy</button>
                                                                                <button onClick={() => handlePinMsg(enquiry.id, enquiryDetail.id)} >Pin to top</button>
                                                                                <button onClick={() => handleStarMsg(enquiryDetail.id)} >Add to star</button>
                                                                                <button className='delete-message-btn' onClick={() => handleDeleteThisMsg(enquiryDetail.id, enquiryDetail.msg)}>Delete this message</button>
                                                                            </div>
                                                                        }
                                                                        <button onClick={(e) => handleReactionOpen(e, index)}>
                                                                            <i className="admin-font adminLib-smile-o" />
                                                                        </button>
                                                                        <button onClick={(e) => handleChatTextBtnOpen(e, index)}>
                                                                            <i className="admin-font adminLib-more-vertical" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="chat-time">{enquiryDetail.date}</div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                            </>
                                        ))}
                                    </ul>
                                </div>
                                {/* //////////////////////////////////////// Submit sections ///////////////////////////////////////// */}
                                <EnquirySubmit enquiry={enquiry} message={message} setMessage={setMessage} fetchData={fetchData} FileDisplay={FileDisplay} reply={reply} setReply={setReply}/>
                            </>
                            :
                            <div>
                                loading...
                            </div>
                    }
                </div>
            </div>
        </>
    );
}

export default EnquiryDetails;