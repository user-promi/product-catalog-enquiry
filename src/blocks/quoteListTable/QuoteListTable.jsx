import React, { useState, useEffect } from 'react';
import { __ } from "@wordpress/i18n";
import CustomTable, { TableCell } from "../../components/AdminLibrary/CustomTable/CustomTable";
import { getApiLink } from "../../services/apiService";
import axios from 'axios';
import './QuoteListTable.scss';

const QuoteList = () => {
	const [data, setData] = useState(null);
	const [selectedRows, setSelectedRows] = useState([]);
	const [productQuantity, setProductQuantity] = useState([]);
	const [loading, setLoading] = useState(false);
	const [responseContent, setResponseContent] = useState(false);
	const [responseStatus, setResponseStatus] = useState('');
	const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

	const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

	useEffect(() => {
		requestData();
	}, []);

	const handleQuantityChange = (e, id, key) => {
		setProductQuantity(prev => ({
            ...prev,
            [id]: {
                quantity: e.target.value,
                key: key
            }
        }));
		
	}

	function requestData() {

		//Fetch the data to show in the table
		axios({
			method: "post",
			url: getApiLink('get-all-quote'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
		}).then((response) => {
			setData(response.data);
		});

	}

	const handleRemoveCart = (e, id, key) => {
		axios({
			method: "post",
			url: getApiLink('quote-remove-cart'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				productId : id,
				key : key
			},
		}).then((response) => {
			requestData();
		});
	}

	const handleUpdateCart = () => {
		const newProductQuantity = selectedRows.length > 0 ? 
			selectedRows.map(row => {
				let id = row.id;
				let value = productQuantity[id].quantity || 1;
				return {
					key: row.key,
					id: id,
					quantity: value
				};
				})
			: Object.entries(productQuantity).map(([id, value]) => ({
				id: id,
				quantity: value.quantity,
    			key: value.key
    	}));

		axios({
			method: "post",
			url: getApiLink('quote-update-cart'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				products : newProductQuantity
			},
		}).then((response) => {
			requestData();
		});
	}

	const handleSendQuote = () => {
		const sendBtn = document.getElementById('SendQuote');
		sendBtn.style.display = 'none';
		setLoading(true);
		axios({
			method: "post",
			url: getApiLink('quote-send'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				formData : formData,
			},
		}).then((response) => {
			console.log(response);
			setLoading(false);
			setResponseContent(true);
			if(response.status === 200 ){
				setResponseStatus("success")
				setTimeout(() => {
					window.location.href = response.data.redirect_url;
				}, 3000);
			} else{
				setResponseStatus("error");
				sendBtn.style.display = 'block';
				return;
			}
		});
	}

	const Loader = () =>{
		return(
			<section className='loader_wrapper'>
				<div className='loader'></div>
			</section>
		)
	}

	//columns for the data table
	const columns = [
		{
			name: __("Remove", "woocommerce-catalog-enquiry"),
			cell: (row) =>
				<TableCell title="remove" >
						<p onClick={(e) => handleRemoveCart(e, row.id, row.key)}>cross</p>
				</TableCell>,
		},
		{
			name: __("Image", "woocommerce-catalog-enquiry"),
			cell: (row) =>
				<TableCell title="image" >
						<p dangerouslySetInnerHTML={{ __html: row.image }}></p>
				</TableCell>,
		},
		{
			name: __("Name", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="name">
                        <p dangerouslySetInnerHTML={{ __html: row.name }}></p>
				</TableCell>
			),
		},
        {
			name: __("Quantity", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="quantity">
						<input type="number" name="quantity" min="1" value={productQuantity[row.id]?.quantity ?? row.quantity} placeholder="1" onChange={(e) => handleQuantityChange(e, row.id, row.key)} />
				</TableCell>
			),
		},
		{
			name: __("Subtotal", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="subtotal">
						<p dangerouslySetInnerHTML={{ __html: row.total }}></p>
				</TableCell>
			),
		},

	];

	return (
		<>
			<div className="admin-enrollment-list QuoteListTable-main-wrapper">
				<div className="admin-page-title">
					<div className="add-to-quotation-button">
						<button onClick={handleUpdateCart}>
							{__("Update Cart", "woocommerce-catalog-enquiry")}
						</button>
					</div>
				</div>
				{
					<CustomTable
						data={data}
						columns={columns}
						selectable={true}
						handleSelect={(selectRows) => {
							setSelectedRows(selectRows);
						}}
						// autoLoading={false}
					/>
				}
			</div>
			
			{data && Object.keys(data).length > 0 && 
				<div className='main-form'>
					{	loading &&
						<Loader />
					}
					<p className='form-row form-row-first'>
						<label htmlFor="name">{__("Name:", "woocommerce-catalog-enquiry")}</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
						/>
					</p>
					<p className='form-row form-row-last'>
						<label htmlFor="email">{__("Email:", "woocommerce-catalog-enquiry")}</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
						/>
					</p>
					<p className="form-row form-row-wide">
						<label htmlFor="phone">{__("Phone:", "woocommerce-catalog-enquiry")}</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleInputChange}
						/>
					</p>
					<p className='form-row form-row-wide'>
						<label htmlFor="message">{__("Message:", "woocommerce-catalog-enquiry")}</label>
						<textarea
							id="message"
							name="message"
							rows="4"
							cols="50"
							value={formData.message}
							onChange={handleInputChange}
						></textarea>
					</p>
					<p>
						<button id='SendQuote' onClick={handleSendQuote}> {__("Send Quote", "woocommerce-catalog-enquiry")} </button>
					</p>
					{	
						responseContent &&
						<section className={`response-message-container ${responseStatus}`}>
							<p>{responseStatus === 'error' ? "Something went  wrong! Try Again" : "Form submitted successfully"}</p>
						</section>
					}
				</div>
			}
		</>

	);
}
export default QuoteList;