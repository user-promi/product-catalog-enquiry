// import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { __ } from "@wordpress/i18n";
import CustomTable, { TableCell } from "../../components/AdminLibrary/CustomTable/CustomTable";
import { getApiLink } from "../../services/apiService";
import axios from 'axios';
// import Dialog from "@mui/material/Dialog";
import './ProductListTable.scss';

const WholesaleProductList = () => {
	const [data, setData] = useState(null);
	const [selectedRows, setSelectedRows] = useState([]);
	const [totalRows, setTotalRows] = useState();
	const [openDialog, setOpenDialog] = useState(false);
	const [category, setCategory] = useState([]);
	const [productQuantity, setProductQuantity] = useState([]);

	useEffect(() => {
        axios({
            method: "post",
            url: getApiLink('get-wholesale-products'),
            headers: { "X-WP-Nonce": appLocalizer.nonce },
            data: {
                counts: true
            },
        }).then((response) => {
            setTotalRows(response.data);
        });
	}, []);

	useEffect(() => {
        axios({
            method: "post",
            url: getApiLink('get-all-categories'),
            headers: { "X-WP-Nonce": appLocalizer.nonce },
        }).then((response) => {
            setCategory(response.data);
        });
	}, []);

	useEffect(() => {
		requestData();
	}, []);

	const handleQuantityChange = (e, id) => {
		// setQuantity(e.target.value);
		setProductQuantity(prev => ({
            ...prev,
            [id]: e.target.value
        }));
		
	}

	function requestData(
		rowsPerPage = 10,
		currentPage = 1,
		typeCount = "",
		catagoryField = '',
		searchField = "",
		searchAction = ""
	) {

		//Fetch the data to show in the table
		axios({
			method: "post",
			url: getApiLink('get-wholesale-products'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				page: currentPage,
				row: rowsPerPage,
				status: typeCount == 'all' ? '' : typeCount,
				catagory: catagoryField,
				search: searchField,
				action: searchAction
			},
		}).then((response) => {
			setData(response.data);
		});

	}

	const handleAddCart =() => {
		const newProductQuantity = selectedRows.map(row => {
			let id = row.id;
			let value = productQuantity[id] || 1;
			return {
				id: id,
				quantity: value
			};
		});

		newProductQuantity.forEach(product => {
			axios({
			  method: "post",
			  url: `${appLocalizer.apiurl}/wc/store/v1/cart/add-item`,
			  dataType: 'json',
			  headers: { "X-WC-Store-API-Nonce": appLocalizer.cart_nonce },
			  data: {
				id: product.id,
				quantity: product.quantity,
			  },
			}).then((response) => {
				// console.log(response);
			});
		  });

	}

	const requestApiForData = (rowsPerPage, currentPage, filterData = {}) => {
		
		setData(null);

		requestData(
			rowsPerPage,
			currentPage,
			filterData?.typeCount,
			filterData?.catagoryField,
			filterData?.searchField,
			filterData?.searchAction
		);
	};

	const realtimeFilter = [
		{
            name: "catagoryField",
            render: (updateFilter, filterValue) => {
                return (
                    <>
                        <div className="admin-header-search-section catagoryField">
                            <select
                                name="catagoryField"
                                onChange={(e) => updateFilter(e.target.name, e.target.value)}
                                value={filterValue || ""}
                            >
                                <option value="">Category</option>
                                {Object.entries(category).map(([categoryId, categoryName]) => (
                                    <option value={categoryId}>{categoryName}</option>
                                ))}
                            </select>
                        </div>
                    </>
                );
            }
		},
		{
            name: "searchField",
            render: (updateFilter, filterValue) => (
                <>
                    <div className="admin-header-search-section searchField">
                        <input
                            name="searchField"
                            type="text"
                            placeholder={__("Search...", "moowoodle")}
                            onChange={(e) => updateFilter(e.target.name, e.target.value)}
                            value={filterValue || ""}
                        />
                    </div>
                </>
            ),
        },
		{
            name: "searchAction",
            render: (updateFilter, filterValue) => {
                return (
                    <>
                        <div className="admin-header-search-section searchAction">
                            <select
                                name="searchAction"
                                onChange={(e) => updateFilter(e.target.name, e.target.value)}
                                value={filterValue || ""}
                            >
                                <option value="">Select</option>
                                <option value="name">Name</option>
                                <option value="sku">SKU</option>
                            </select>
                        </div>
                    </>
                );
            },
        },
	];

	//columns for the data table
	const columns = [
		{
			name: __("SKU", "woocommerce-catalog-enquiry"),
			cell: (row) =>
				<TableCell title="sku" >
					<div className="action-section">
						<p>{row.sku}</p>
					</div>
				</TableCell>,
		},
		{
			name: __("Image", "woocommerce-catalog-enquiry"),
			cell: (row) =>
				<TableCell title="image" >
					{/* <img src={row.course_img || defaultImage} alt="" /> */}
					<div className="action-section">
						<img src={row.image[0]} alt="" />
						{/* <img src={row.image[0]} alt="" style="max-width: 80px; height: auto;"></img> */}
					</div>
				</TableCell>,
		},
		{
			name: __("Name", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="name">
					<div className='action-section'>
                        <p dangerouslySetInnerHTML={{ __html: row.name }}></p>
					</div>
				</TableCell>
			),
		},
		{
			name: __("Stock", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="stock">
					<div className='action-section'>
                        <p>{row.stock}</p>
					</div>
				</TableCell>
			),
		},
		{
			name: __("Price", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="price">
					<div className='action-section'>
                        <p>{row.price}</p>
					</div>
				</TableCell>
			),
		},
        {
			name: __("Quantity", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="quantity">
					<div className='action-section' >
						<input type="number" name="quantity" min="1" value={productQuantity[row.id]} placeholder="1" onChange={(e) => handleQuantityChange(e, row.id)} />
					</div>
				</TableCell>
			),
		}

	];

	return (
		<>
			{/* {!appLocalizer.pro_active ? (
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
							className="admin-font font-cross stock-manager-popup-cross"
							onClick={() => {
								setOpenDialog(false);
							}}
						></span>
						<Popoup />
					</Dialog>
					<div
						className="enrollment-img"
						onClick={() => {
							setOpenDialog(true);
						}}>
					</div>
				</>
			) : ( */}
				<div className="product-list-table-main-wrapper">
					<div className="admin-page-title">
						<p>{__("All Wholesale Users", "woocommerce-catalog-enquiry")}</p>
						<div className="add-to-quotation-button">
							<button onClick={handleAddCart}>
								Add To Cart
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
							handlePagination={requestApiForData}
							defaultRowsParPage={10}
							defaultTotalRows={totalRows}
							perPageOption={[10, 25, 50]}
							realtimeFilter={realtimeFilter}
							// typeCounts={wholesaleUserStatus}
							autoLoading={false}
						/>
					}
				</div>
			{/* )} */}
		</>

	);
}
export default WholesaleProductList;