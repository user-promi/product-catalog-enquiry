import React from 'react';
import EnquiryMessages from '../enquiryMessages';
import axios from 'axios';

const EnquiryControlsBtn = ( { enquiry } ) => {
  // console.log(enquiry)
  const handleDeleteEnq = (id) => {
      axios({
        method: "post",
        url: `${appLocalizer.apiurl}/catalog/v1/delete-enquiry`,
        data: {
            id: id,
        },
      }).then((response) => {
        <EnquiryMessages />
      });
  }

  const handleDownloadPDF = (id) => {
    axios({
      method: "post",
      url: `${appLocalizer.apiurl}/catalog/v1/download-enquiry-msg`,
      data: {
        id: id,
      },
      responseType: 'blob' // Important for handling binary data
    })
    .then((response) => {
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enquiry-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading PDF:", error);
    });
  }
  
  return (
    <>
        <section className='enquiry-control-btn'>
            <button className='control-btn' onClick={(e) => { handleDeleteEnq(enquiry.id) }}>Delete Enquiry</button>
            <button className='control-btn' onClick={(e) => { handleDownloadPDF(enquiry.id) }}>Download PDF</button>
        </section>
    </>
  )
}

export default EnquiryControlsBtn;