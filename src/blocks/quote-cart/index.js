// import { render } from '@wordpress/element';
// import { BrowserRouter } from 'react-router-dom';
// import QuoteListTable from './QuoteListTable';

// // Render the App component into the DOM
// render(<BrowserRouter>
// <QuoteListTable/>
// </BrowserRouter>, document.getElementById('request_quote_list'));

import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import { render } from "@wordpress/element";
import { BrowserRouter } from 'react-router-dom';
import QuoteListTable from './QuoteListTable';

registerBlockType("woocommerce-catalog-enquiry/quote-cart", {
	apiVersion: 2,
	title: "Quote Cart",
	icon: "list-view",
	category: "widgets",
	supports: {
		html: false,
	},
	edit() {
		const blockProps = useBlockProps();
		return (
		<div {...blockProps} id="request_quote_list">
			{QuoteListTable()}
		</div>
		);
	},
	save() {
		return (
		<div id="request_quote_list">
		</div>
		);
	},
});

document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("request_quote_list");
  if (element) {
    render(
      <BrowserRouter>
        <QuoteListTable />
      </BrowserRouter>,
      element
    );
  }
});
