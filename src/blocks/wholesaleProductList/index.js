// import { render } from '@wordpress/element';
// import { BrowserRouter } from 'react-router-dom';
// import WholesaleProductList from './ProductListTable';

// // Render the App component into the DOM
// render(
//     <BrowserRouter>
//         <WholesaleProductList />
//     </BrowserRouter>,
//     document.getElementById('wholesale_product_list')
// );

import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import { render } from "@wordpress/element";
import { BrowserRouter } from 'react-router-dom';
import WholesaleProductList from "./ProductListTable";

registerBlockType("woocommerce-catalog-enquiry/wholesale-product-list", {
	apiVersion: 2,
	title: "Wholesale Product List",
	icon: "list-view",
	category: "widgets",
	supports: {
		html: false,
	},
	edit() {
		const blockProps = useBlockProps();
		return (
		<div {...blockProps} id="wholesale_product_list">
			{WholesaleProductList()}
		</div>
		);
	},
	save() {
		return (
		<div id="wholesale_product_list">
		</div>
		);
	},
});

document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("wholesale_product_list");
  if (element) {
    render(
      <BrowserRouter>
        <WholesaleProductList />
      </BrowserRouter>,
      element
    );
  }
});
