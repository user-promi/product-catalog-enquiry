import { render } from '@wordpress/element';
import { BrowserRouter } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';

// Render the App component into the DOM
render(<BrowserRouter><RegistrationForm/></BrowserRouter>, document.getElementById('wholesale_register'));
