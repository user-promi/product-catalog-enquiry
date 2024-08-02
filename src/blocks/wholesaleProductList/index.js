import { render } from '@wordpress/element';
import { BrowserRouter } from 'react-router-dom';
import WholesaleProductList from './ProductListTable';

// Render the App component into the DOM
render(<BrowserRouter>
<WholesaleProductList/>
</BrowserRouter>, document.getElementById('wholesale_product_list'));
