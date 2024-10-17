import axios from "axios";
import { CSVLink } from "react-csv";
import { __ } from "@wordpress/i18n";
import Dialog from "@mui/material/Dialog";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Popoup from "../PopupContent/PopupContent";
import CustomTable, {
  TableCell,
} from "../AdminLibrary/CustomTable/CustomTable";
import './quoteRequests.scss';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { useModules } from '../../contexts/ModuleContext.jsx';


export default function QuotesList() {

  // Check pro is active and module is active or not.
  const { modules } = useModules();

  if (!modules.includes('quote') || !appLocalizer.pro_active) {
    return (
      <div> Pro required || Activate module </div>
    );
  }


  const fetchQuotesDataUrl = `${appLocalizer.apiurl}/catalog/v1/get-quotes-list`;
  const fetchQuotesCount = `${appLocalizer.apiurl}/catalog/v1/get-table-segment`;
  const [postStatus, setPostStatus] = useState("");
  const [data, setData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRows, setTotalRows] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [quotesStatus, setQuotesStatus] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleDateOpen = () => {
    setOpenDatePicker(!openDatePicker);
  }

  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  function requestData(
    rowsPerPage = 10,
    currentPage = 1,
    searchField = "",
    searchAction = "",
    start_date = new Date(0),
    end_date = new Date(),
    postStatus
  ) {
    //Fetch the data to show in the table
    axios({
      method: "post",
      url: fetchQuotesDataUrl,
      headers: { "X-WP-Nonce": appLocalizer.nonce },
      data: {
        page: currentPage,
        row: rowsPerPage,
        postStatus: postStatus,
        search: searchField,
        action: searchAction,
        start_date: start_date,
        end_date: end_date,
      },
    }).then((response) => {
      const data = JSON.parse(response.data);
      setData(data);
    });
  }

  const requestApiForData = (rowsPerPage, currentPage, filterData = {}) => {
    requestData(
      rowsPerPage,
      currentPage,
      filterData?.searchField,
      filterData?.searchAction,
      filterData?.date?.start_date,
      filterData?.date?.end_date,
      filterData.typeCount
    );
  };

  const filterForCSV = (datas) => {
    if (selectedRows.length) {
      datas = selectedRows;
    }
  
    // Map through the data and modify each field as needed
    return datas.map(({ order, date, status, total }) => {
      // Extract order ID and customer name from the HTML link using a regular expression
      const orderMatch = order.match(/>(#[0-9]+) (.+)<\/strong>/);
      const orderId = orderMatch ? orderMatch[1] : order ;
      const customerName = orderMatch ? orderMatch[2] : "";

      // Format the date if necessary (e.g., to 'MM/DD/YYYY' format)
      const formattedDate = new Date(date).toLocaleDateString();
  
      // Return the modified data object
      return {
        orderId: orderId,
        customer: customerName,
        date: formattedDate,
        status: getStatus(status),
        total,
      };
    });
  };
  
  // const filterForCSV = (datas) => {
  //   if (selectedRows.length) {
  //     datas = selectedRows;
  //   }
  //   console.log(datas)
  //   return datas.map(({ order, date, status, total }) => { return { order, date, status, total } });
  // }

  useEffect(() => {
    requestData();
  }, [postStatus]);

  useEffect(() => {
    axios({
      method: "post",
      url: fetchQuotesCount,
      headers: { "X-WP-Nonce": appLocalizer.nonce },
    }).then((response) => {
      response = response.data;

      setTotalRows(response["all"]);

      setQuotesStatus([
        {
          key: "all",
          name: __("All", "woocommerce-catalog-enquiry"),
          count: response["all"],
        },
        {
          key: "wc-quote-new",
          name: __("New", "woocommerce-catalog-enquiry"),
          count: response["wc-quote-new"],
        },
        {
          key: "wc-quote-pending",
          name: __("Pending", "woocommerce-catalog-enquiry"),
          count: response["wc-quote-pending"],
        },
        {
          key: "wc-quote-accepted",
          name: __("Accepted", "woocommerce-catalog-enquiry"),
          count: response["wc-quote-accepted"],
        },
        {
          key: "wc-quote-expired",
          name: __("Expired", "woocommerce-catalog-enquiry"),
          count: response["wc-quote-expired"],
        },
        {
          key: "wc-quote-rejected",
          name: __("Rejected", "woocommerce-catalog-enquiry"),
          count: response["wc-quote-rejected"],
        },
      ]);
    });
  }, []);

  const dateRef = useRef();

  useEffect(() => {
    document.body.addEventListener("click", (event) => {
      if (!dateRef?.current?.contains(event.target)) {
        setOpenDatePicker(false);
      }
    })
  }, [])

  const realtimeFilter = [

    {
      name: "date",
      render: (updateFilter, value) => (
        <div ref={dateRef}>
          <div className="admin-header-search-section">
            <input value={`${selectedRange[0].startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${selectedRange[0].endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`} onClick={() => handleDateOpen()} className="date-picker-input-custom" type="text" placeholder={__("DD/MMM/YYYY", "woocommerce-catalog-enquiry")} />
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
    {
      name: "searchField",
      render: (updateFilter, filterValue) => (
        <>
          <div className="admin-header-search-section searchField filter-left-wrapper">
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
                <option value="order_id">Order ID</option>
                <option value="customer_name">Customer Name</option>
                <option value="customer_email">Customer Email</option>
              </select>
            </div>
          </>
        );
      },
    },
  ];

  const getStatus = (status) => {
    switch (status) {
      case 'quote-new':
        return __('New', 'woocommerce-catalog-enquiry');
      case 'quote-pending':
        return __('Pending', 'woocommerce-catalog-enquiry');
      case 'quote-expired':
        return __('Expired', 'woocommerce-catalog-enquiry');
      case 'quote-accepted':
        return __('Accepted', 'woocommerce-catalog-enquiry');
      case 'quote-rejected':
        return __('Rejected', 'woocommerce-catalog-enquiry');
      default:
        return __('-', 'woocommerce-catalog-enquiry');
    }
    return $quote_status;
  }

  //columns for the data table
  const columns = [
    {
      name: __("Order", "woocommerce-catalog-enquiry"),
      cell: (row) =>
        <TableCell title="Order" >
          <p dangerouslySetInnerHTML={{ __html: row.order }}></p>
        </TableCell>,
    },
    {
      name: __("Date", "woocommerce-catalog-enquiry"),
      cell: (row) =>
        <TableCell title="Date">
          {row.date}
        </TableCell>,
    },
    {
      name: __("Status", "woocommerce-catalog-enquiry"),
      cell: (row) => <TableCell title="Status" className={row.status}> <span>{getStatus(row.status)}</span> </TableCell>,
    },
    {
      name: __("Total", "woocommerce-catalog-enquiry"),
      cell: (row) => <TableCell title="Total" > {row.total} </TableCell>,
    },
  ];

  return (
    <div>
      <div className="admin-subscriber-list">
        <div className="admin-page-title">
          <p>{__("Quotes List", "woocommerce-catalog-enquiry")}</p>
          <div className="add-to-quotation-button">
            <a className="" href="admin-ajax.php?action=add_quote_from_adminend">
              Add Quote
            </a>
          </div>
          <div className="download-btn-subscriber-list">
            <CSVLink
              data={filterForCSV(data || [])}
              filename={"Quotes.csv"}
              className="admin-btn btn-purple"
            >
              <div className="wp-menu-image dashicons-before dashicons-download"></div>
              {__("Download CSV", "woocommerce-catalog-enquiry")}
            </CSVLink>
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
            typeCounts={quotesStatus}
          />
        }
      </div>
    </div>
  );
}