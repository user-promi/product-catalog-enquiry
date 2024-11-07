import { render } from '@wordpress/element';
import { BrowserRouter} from 'react-router-dom';
import App from './app.js';
// import CustomFrom from './components/RegistrationForm/RegistrationForm.jsx';

/**
 * Import the stylesheet for the plugin.
 */
import './style/common.scss';

// Render the App component into the DOM
render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('admin-catalog'));
