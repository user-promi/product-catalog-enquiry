import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./enquiryMessages.scss";
import EnquiryNavbar from './enquiryNavbar.jsx';
import EmojiPicker from 'emoji-picker-react';

const MediaUploader = (props) => {
    let frame
    const runUploader = (event) => {
        event.preventDefault()

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open()
            return
        }

        // Create a new media frame
        frame = wp.media({
            title: 'Select or Upload Media Of Your Chosen Persuasion',
            button: {
                text: 'Use this media',
            },
            multiple: false, // Set to true to allow multiple files to be selected
        })

        frame.on('select', function(){
            var selection = frame.state().get('selection');
            selection.map( function( attachment ) {
              attachment = attachment.toJSON();
                props.onChange(attachment);
            });
        });

        // Finally, open the modal on click
        frame.open()
    }

    return (
        <React.Fragment>
            <button type='button' onClick={runUploader}>
                {props.children}
            </button>
        </React.Fragment>
    )
}

const FileDisplay = ({ fileUrl, fileType }) => {
    const renderFile = () => { ""
        if (fileType.includes('image')) {
            return <img src={fileUrl} alt="file" style={{ maxWidth: '100%' }} />;
        }

        switch (fileType) {
            case 'pdf':
            return (
                <iframe
                src={fileUrl}
                style={{ width: '100%', height: '500px' }}
                frameBorder="0"
                />
            );
            case 'text':
            return (
                <iframe
                src={fileUrl}
                style={{ width: '100%', height: '500px' }}
                frameBorder="0"
                />
            );
            default:
            return <p>Unsupported file type</p>;
      }
    };
  
    return <div>{renderFile()}</div>;
};
  
const AtSignList = ({ message, enquery, onSelect }) => {

    const pattern = /@[^!#$%^&*()_+{}|:"<>?`~\[\]\\;/\'\s]*$/;
    const metched = pattern.test(message);

    if (!metched) {
        return;
    }

    function getCharactersAfterAt(str) {
        const parts = str.split('@');
        if (parts.length > 1) {
            return parts[1];
        }
        return '';
    }

    function removeCharactersAfterLastAt(str) {
        const lastIndex = str.lastIndexOf('@');
        if (lastIndex !== -1) {
            return str.substring(0, lastIndex + 1); // Include '@' in the result
        }
        return str; // Handle case where '@' is not found
    }

    return (
        <div>
            {/* Loop for product */}
            {enquery.product?.map((product) => (
                <>
                    {
                        product.name.toLowerCase().includes(getCharactersAfterAt(message).toLowerCase()) &&
                            <div onClick={() => onSelect(`${removeCharactersAfterLastAt(message)}#${product.id}-${product.name}`)}>{product.name}</div>
                    }
                </>
            ))}
            {/* @ for admin */}
            {appLocalizer.user_role !== 'administrator' && (
                <div onClick={() => onSelect(`${message}Admin `)}>Admin</div>
            )}
            {/* @ for vendor */}
            {appLocalizer.user_role !== 'dc_vendor' && (
                <div onClick={() => onSelect(`${message}Vendor `)}>Vendor</div>
            )}
            {/* @ for customer */}
            {appLocalizer.user_role !== 'customer' && (
                <div onClick={() => onSelect(`${message}User `)}>User</div>
            )}
        </div>
    );
}

const EnquiryDetails = (props) => {
    const { enquiry, onDelete } = props;
    const [enquiryDetails, setEnquiryDetails] = useState([]);
    const [searchValue, SetSearchValue] = useState('');
    const scrollDiv = useRef(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [SelectEmoji, setSelectEmoji] = useState(null);
    const [reactionOpen, setReactionOpen] = useState(null);
    const [chatTextBtnOpen, setChatTextBtnOpen] = useState(null);
    const [file, setFile] = useState(null);
    const [reply, setReply] = useState(null);

    useEffect(() => {
        if (enquiry) {
            fetchData();
        }
    }, [enquiry]);

    const fetchData = () => {
        try {
            axios({
                method: "post",
                url: `${appLocalizer.apiUrl}/catalog/v1/get-messages-list`,
                data: { enquiry: enquiry },
            }).then((response) => {
                setEnquiryDetails(response.data);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /**
     * handle message send this will send message and attachments
     */
    const handleSendMessage = () => {
        const attachment = file?.id;

        axios({
            method: "post",
            url: `${appLocalizer.apiUrl}/catalog/v1/send-messages`,
            data: {
                attachment: attachment,
                msgReply: message,
                enquiry: enquiry,
            },
        }).then((response) => {
            setMessage('');
            setFile(null);
            fetchData();
            setReply(null)
        });
    };

    // console.log(file)
    // console.log(enquiry)
    console.log(enquiryDetails)
    // useEffect(() => {
    //     console.log("hit");
    //     scrollDiv.current.scrollIntoView({ behavior: "smooth", block: "end" })
    //     console.log("hit again");
    // }, [enquiry])

    // const handleFileChange = (event) => {
    //     console.log("hello");
    //     setFile(event.target.files[0]);
    // };

    const handleDeleteFile = () => {
        setFile(null);
    };

    // Function to handle emoji click
    const onEmojiClick = (emojiData, event) => {
        if (emojiData && emojiData.emoji) {
            setMessage((prevMessage) => prevMessage + emojiData.emoji);
        } else {
            console.error('No emoji object received.');
        }
    };

    // Function to toggle emoji picker visibility
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleReactionOpen = (index) => {
        if (reactionOpen === index) {
            setReactionOpen(null);
        }
        else {
            setReactionOpen(index);
        }
        setChatTextBtnOpen(null);
    };

    const handleChatTextBtnOpen = (index) => {
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
        console.log(id)
        console.log(msg)
    };

    const [chosenEmoji, setChosenEmoji] = useState(null);

    // const onEmojiClick = (event, emojiObject) => {
    //     setChosenEmoji(emojiObject);
    //     // You can handle the chosen emoji here, e.g., add it to the message input
    // };
    const onReactionClick = (id, emojiObject, event) => {
        axios({
            method: "post",
            url: `${appLocalizer.apiUrl}/catalog/v1/save-reaction`,
            data: {
                msgId: id,
                emoji: emojiObject.emoji,
            },
        }).then((response) => {
            fetchData();
            setSelectEmoji(emojiObject.emoji);
            setReactionOpen(null);
        });
        // console.log(emojiObject.names)
        // console.log(emojiObject.emoji)
        // console.log(id)

    }

    const handleMsgSearch = (e) => {
        SetSearchValue(e.target.value);
        console.log(e.target.value)
    }

    const handleDeleteThisMsg = (id, msg) => {
        console.log(id)
        console.log(msg)
        axios({
            method: "post",
            url: `${appLocalizer.apiUrl}/catalog/v1/delete-msg`,
            data: {
                msgId: id,
                msg: msg,
            },
        }).then((response) => {
            fetchData();
        });

    };

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
        // return [...enquiryDetails];
    };

    return (
        <>
            <div className="chatting-container">
                <div className="chat-wrapper">
                    <EnquiryNavbar enquiry={enquiry} onChange={(e) => handleMsgSearch(e)} />
                    <div className="chatting-main-container" ref={scrollDiv} >
                        <ul className="wrapper" >
                            {getFilterEnquiryDetails().map((enquiryDetail, index) => (
                                <>
                                    {enquiryDetail.admin_msg ? (
                                        <li key={index} className="send message-box">
                                            <div className="message-box-wrapper">
                                                <div className="sender-img">
                                                    <img src="https://shorturl.at/gGILQ" alt="" />
                                                </div>
                                                <div className="chat-content-wrapper">
                                                    <div className="chat-content">
                                                        {
                                                            enquiryDetail.attachment &&
                                                            <div style={{'width': '100px', 'height': '100px'}}>
                                                                <FileDisplay fileUrl={ enquiryDetail.attachment } fileType={enquiryDetail.attachment_type} />
                                                            </div>
                                                        }
                                                        <div className="content">
                                                            <div dangerouslySetInnerHTML={{ __html: enquiryDetail.msg }} />
                                                            <div className="status">
                                                                <i className="admin-font font-check" />
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
                                                                    <button onClick={() => handleDeleteThisMsg(enquiryDetail.id, enquiryDetail.msg)}>Delete this message</button>
                                                                </div>
                                                            }
                                                            <button onClick={() => handleReactionOpen(index)}>
                                                                <i className="admin-font font-smile-o" />
                                                            </button>
                                                            <button onClick={() => handleChatTextBtnOpen(index)}>
                                                                <i className="admin-font font-more-vertical" />
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
                                                                <div style={{'width': '100px', 'height': '100px'}}>
                                                                    <FileDisplay fileUrl={ enquiryDetail.attachment } fileType={enquiryDetail.attachment_type} />
                                                                </div>
                                                            }
                                                            <div dangerouslySetInnerHTML={{ __html: enquiryDetail.msg }} />
                                                            <div className="status">
                                                                <i className="admin-font font-check" />
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
                                                                    <button onClick={() => handleDeleteThisMsg(enquiryDetail.id, enquiryDetail.msg)}>Delete this message</button>
                                                                </div>
                                                            }
                                                            <button onClick={() => handleReactionOpen(index)}>
                                                                <i className="admin-font font-smile-o" />
                                                            </button>
                                                            <button onClick={() => handleChatTextBtnOpen(index)}>
                                                                <i className="admin-font font-more-vertical" />
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
                </div>
                
                {/* //////////////////////////////////////// Submit sections ///////////////////////////////////////// */}
                <div className="chat-controls">
                    <div className="wrapper">
                        <div className="attachment">
                            <div className="attachment-wrapper">
                                <MediaUploader
                                    onChange={(attachment) => {
                                        setFile(attachment);
                                    }}
                                >
                                    <label>
                                        <i className="admin-font font-attachment" />
                                    </label>
                                </MediaUploader>
                                <button onClick={toggleEmojiPicker} className='option-btn'>
                                    <i className="admin-font font-smile-o" />
                                </button>
                                {showEmojiPicker && (
                                    <div className='emoji-picker-container'>
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            autoFocusSearch={false}
                                            Theme={'auto'}
                                            skinTonesDisabled={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="typing-section">
                            {/* @ sections */}
                            {
                                <AtSignList
                                    message={message}
                                    enquery={enquiry}
                                    onSelect={setMessage}
                                />
                            }
                            <textarea name="reply_msg" id="reply_msg" value={message}
                                onChange={(e) => setMessage(e.target.value)} />
                            {reply && (
                                <div className='reply-text-preview'>
                                    <p dangerouslySetInnerHTML={{ __html: reply }}></p>
                                    <button><i className='admin-font font-close'></i></button>
                                </div>
                            )}
                            {console.log(file)}
                            {file && (
                                <div className='attachment-details-section'>
                                    <p>{file.name}</p>
                                    <FileDisplay fileUrl={ file.link } fileType={file.type} />
                                    <button onClick={handleDeleteFile}><i className='admin-font font-close'></i></button>
                                </div>
                            )}
                        </div>
                        <div className="send">
                            <button className="message-send-btn" id="send_msg" onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EnquiryDetails;