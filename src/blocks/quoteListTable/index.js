import { render } from '@wordpress/element';
import { BrowserRouter } from 'react-router-dom';
import QuoteListTable from './QuoteListTable';

// Render the App component into the DOM
render(<BrowserRouter>
<QuoteListTable/>
</BrowserRouter>, document.getElementById('request_quote_list'));
