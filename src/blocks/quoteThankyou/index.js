import { render } from '@wordpress/element';
import { BrowserRouter } from 'react-router-dom';
import QuoteThankYou from './QuoteThankYou';

// Render the App component into the DOM
render(<BrowserRouter>
<QuoteThankYou/>
</BrowserRouter>, document.getElementById('quote_thank_you_page'));
