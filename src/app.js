import React from 'react';
import { useLocation } from 'react-router-dom';

import Settings from './components/Settings/Settings.jsx';
import Modules from './components/Modules/Modules.jsx';
import { ModuleProvider } from './contexts/ModuleContext.jsx';
import QuotesList from './components/QuoteRequests/quoteRequests.jsx'; 
import EnquiryMessages from './components/EnquiryMessages/enquiryMessages.jsx';
import WholesaleUser from './components/WholesaleUser/wholesaleUser.jsx';
import Rules from './components/Rules/Rules.jsx';

const Route = () => {
    const currentTab = new URLSearchParams(useLocation().hash);
    return (
        <>
            { currentTab.get('tab') === 'settings' && <Settings initialTab='general' id="settings" /> }
            { currentTab.get('tab') === 'modules' && <Modules/> }
            { currentTab.get('tab') === 'quote-requests' && <QuotesList />}
            { currentTab.get('tab') === 'wholesale-users' && <WholesaleUser />}
            { currentTab.get('tab') === 'enquiry-messages' && <EnquiryMessages />}
            { currentTab.get('tab') === 'rules' && <Rules />}
        </>
    );
}

const App = () => {
    const currentTabParams = new URLSearchParams(useLocation().hash);
    
    document.querySelectorAll('#toplevel_page_catalog>ul>li>a').forEach((menuItem) => {
        const menuItemUrl = new URL(menuItem.href);
        const menuItemHashParams = new URLSearchParams(menuItemUrl.hash.substring(1));

        menuItem.parentNode.classList.remove('current');
        if ( menuItemHashParams.get('tab') === currentTabParams.get('tab')) {
            menuItem.parentNode.classList.add('current');
        }
    });
   
    return (
        <>
            <ModuleProvider modules = {appLocalizer.active_modules}><Route/></ModuleProvider>
        </>
    )
}

export default App;