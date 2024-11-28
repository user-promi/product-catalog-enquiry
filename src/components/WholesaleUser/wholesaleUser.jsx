import React, { useState, useEffect, useRef } from 'react';
import { __ } from "@wordpress/i18n";
import CustomTable, { TableCell } from "../AdminLibrary/CustomTable/CustomTable";
import { getApiLink } from "../../services/apiService";
import axios from 'axios';
import Dialog from "@mui/material/Dialog";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Popoup from "../PopupContent/PopupContent.jsx";
import './wholesaleUser.scss';
import defaultImage from '../../assets/images/default.png';
import ViewPopup from './viewPopup.jsx';

import { useModules } from '../../contexts/ModuleContext.jsx';

const WholesaleUser = () => {
	// Check pro is active and module is active or not.
    const { modules } = useModules();
    if ( ! modules.includes( 'wholesale' ) || ! appLocalizer.pro_active ) {
        return (
            <div className='wholesale-user-image'></div>
        ); 
    }

	const fetchUsersCount = getApiLink('get-user-table-segment');
	const [data, setData] = useState(null);
	const [selectedRows, setSelectedRows] = useState([]);
	const [wholesaleUserStatus, setwholesaleUserStatus] = useState(null);
	const [totalRows, setTotalRows] = useState();
	const [openDialog, setOpenDialog] = useState(false);
	const [openDatePicker, setOpenDatePicker] = useState(false);
	const dateRef = useRef();
	
	useEffect(() => {
		document.body.addEventListener("click", (event) => {
			if (!dateRef?.current?.contains(event.target)) {
				setOpenDatePicker(false);
			}
		})
	}, [])

	useEffect(() => {
		if (appLocalizer.pro_active) {
			axios({
				method: "post",
				url: getApiLink('get-wholesale-users'),
				headers: { "X-WP-Nonce": appLocalizer.nonce },
				data: {
					counts: true
				},
			}).then((response) => {
				setTotalRows(response.data);
			});
		}
	}, []);

	useEffect(() => {
		requestData();
		if (appLocalizer.pro_active) {
		}
	}, []);

	useEffect(() => {
		// if (appLocalizer.pro_active) {
		  axios({
			method: "post",
			url: fetchUsersCount,
			headers: { "X-WP-Nonce": appLocalizer.nonce },
		  }).then((response) => {
			response = response.data;
	
			setTotalRows(response["all"]);
	
			setwholesaleUserStatus([
			  {
				key: "all",
				name: __("All", "woocommerce-catalog-enquiry"),
				count: response["all"],
			  },
			  {
				key: "pending",
				name: __("Pending", "woocommerce-catalog-enquiry"),
				count: response["pending"],
			  },
			  {
				key: "approve",
				name: __("Approve", "woocommerce-catalog-enquiry"),
				count: response["approve"],
			  },
			  {
				key: "reject",
				name: __("Reject", "woocommerce-catalog-enquiry"),
				count: response["reject"],
			  }
			]);
		  });
		// }
	  }, []);

	const handleDateOpen = () => {
		setOpenDatePicker(!openDatePicker);
	}

	const [selectedRange, setSelectedRange] = useState([
		{
			startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
			endDate: new Date(),
			key: 'selection'
		}
	]);

	function requestData(
		rowsPerPage = 10,
		currentPage = 1,
		typeCount = "",
		start_date = new Date(0),
		end_date = new Date()
	) {

		//Fetch the data to show in the table
		axios({
			method: "post",
			url: getApiLink('get-wholesale-users'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				page: currentPage,
				row: rowsPerPage,
				status: typeCount == 'all' ? '' : typeCount,
				start_date: start_date,
				end_date: end_date,
			},
		}).then((response) => {
			setData(response.data);
		});
	}

	const requestApiForData = (rowsPerPage, currentPage, filterData = {}) => {

		// If serch action or search text fields any one of is missing then do nothing 
        // if ( Boolean( filterData?.search_student_field ) ^ Boolean( filterData?.search_student_action ) ) {
        //     return;
		// }
		
		setData(null);

		requestData(
			rowsPerPage,
			currentPage,
			filterData?.typeCount,
			filterData?.date?.start_date,
			filterData?.date?.end_date,
		);
	};

	const realtimeFilter = [
		{
			name: "date",
			render: (updateFilter, value) => (
				<div ref={dateRef}>
					<div className="admin-header-search-section">
						<input
							value={
								selectedRange[0].startDate
									? `${selectedRange[0].startDate.toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})} - ${selectedRange[0].endDate.toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}`
									: '-- -- ----' // Placeholder value when startDate is null
							}
							onClick={() => handleDateOpen()}
							className="date-picker-input-custom"
							type="text"
							placeholder={__("DD/MM/YYYY", "woocommerce-catalog-enquiry")}
						/>
					</div>
					{openDatePicker &&
						<div className="date-picker-section-wrapper">
							<DateRangePicker
								ranges={selectedRange}
								months={1}
								direction="vertical"
								scroll={{ enabled: true }}
								maxDate={new Date()}
								shouldDisableDate={date => isAfter(date, new Date())}
								onChange={(dates) => {
									if (dates.selection) {
										dates = dates.selection;
										dates.endDate?.setHours(23, 59, 59, 999)
										setSelectedRange([dates])
										updateFilter("date", {
											start_date: dates.startDate,
											end_date: dates.endDate,
										});
									}
								}}
							/>
						</div>
					}
				</div>
			),
		},
	];

	const handleUserAction = (id, action) => {
		
		setData(null);

		axios({
			method: "post",
			url: getApiLink('wholesale-user-action'),
			headers: { "X-WP-Nonce": appLocalizer.nonce },
			data: {
				id: id,
				action: action
			},
		}).then((response) => {
			requestData();
		});
	}
	//columns for the data table
	const columns = [
		{
			name: __("User", "woocommerce-catalog-enquiry"),
			cell: (row) =>
				<TableCell title="user_name" >
					<img src={row.customer_img_url || defaultImage} alt="" />
					<div className="action-section">
						<p dangerouslySetInnerHTML={{ __html: row.customer }}></p>
						<div className='action-btn'>
							<a target='_blank' href={row.customer_url} className="">Edit link user</a>
						</div>
					</div>
				</TableCell>,
		},
		{
			name: __("User Email", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="user_email">
                        {row.email}
				</TableCell>
			),
		},
		{
			name: __("Status", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="Status">
					{row.status === 'approve' ? 'Approved' : 'Rejected'}
				</TableCell>
			),
		},
		{
			name: __("Date", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="Date">
					{row.date}
				</TableCell>
			),
		},
        {
			name: __("Action", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="Action">
					<div className='action-section'>
						<button className={`status-show-btn ${row.status === 'approve' ? 'approved' : row.status === 'pending' ? 'pending' : 'rejected'}`}	>
						{row.status === 'approve' ? 'Approved' : row.status === 'pending' ? 'Pending' : 'Rejected'}
						</button>
						<div className='action-btn'>
							{(row.status === 'reject' || row.status === 'pending') &&
								<div onClick={() => handleUserAction(row.id, 'approve')}>
									Approve
								</div>
							}
							{(row.status === 'approve' || row.status === 'pending') &&
								<div className='reject' onClick={() => handleUserAction(row.id, 'reject')}>
									Reject 
								</div>
							}
						</div>
					</div>
				</TableCell>
			),
		},
		{
			name: __("", "woocommerce-catalog-enquiry"),
			cell: (row) => (
				<TableCell title="view">
					<button className='view-application' onClick={(e)=> handleView(row.id)}>
						View Application
					</button>
					{
						<Dialog
							className="admin-wholesale-popup"
							open={openDialog === row.id}
							onClose={() => {
								setOpenDialog(false);
							}}
							aria-labelledby="form-dialog-title"
						>
							<ViewPopup
								setOpenDialog={setOpenDialog}
								addiionalFields = {row.additional_info}
							/>
						</Dialog>
					}
				</TableCell>
			),
		},

	];

    const handleView = (rowId) => {
		setOpenDialog(rowId);
	};

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
				<div className="admin-wholesale-list">
					<div className="admin-page-title">
						<p className='title'>{__("All Wholesale Users", "woocommerce-catalog-enquiry")}</p>
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
							typeCounts={wholesaleUserStatus}
							autoLoading={false}
						/>
					}
				</div>
			{/* )} */}
		</>

	);
}
export default WholesaleUser;