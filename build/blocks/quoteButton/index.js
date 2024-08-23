/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************************!*\
  !*** ./src/blocks/quoteButton/index.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);

// import { registerBlockType } from '@wordpress/blocks';
// import { useBlockProps } from '@wordpress/block-editor';
// import { useState, useEffect } from '@wordpress/element';
// import { RawHTML } from '@wordpress/element';
// import axios from 'axios';

// registerBlockType('woocommerce-catalog-enquiry/quote-button', {
//     title: 'Quote Button',
//     icon: 'button',
//     category: 'widgets',
// 	supports: {
// 		html: true,
// 	},
//     attributes: {
//         content: {
//             type: 'string',
//             default: '',
//         },
//     },
//     edit({ attributes, setAttributes }) {
//         const blockProps = useBlockProps();
//         const [shortcodeContent, setShortcodeContent] = useState(attributes.content);

//         useEffect(() => {
//             if (!shortcodeContent) {
//                 axios({
//                     method: 'post',
//                     url: `${appLocalizer.apiurl}/catalog/v1/render-quote-button`,
//                 }).then((response) => {
//                     setShortcodeContent(response.data);
//                     setAttributes({ content: response.data });
//                 });
//             }
//         }, [shortcodeContent, setAttributes]);

//         return (
//             <div {...blockProps}>
//                 <RawHTML>{shortcodeContent}</RawHTML>
//             </div>
//         );
//     },
// 	save({ attributes }) {
//         // Render the saved content on the front end
//         return (
//             <div>
//                 <RawHTML>{attributes.content}</RawHTML>
//             </div>
//         );
//     },
// });

// import { registerBlockType } from '@wordpress/blocks';
// import { __ } from '@wordpress/i18n';

// registerBlockType('woocommerce-catalog-enquiry/quote-button', {
//     title: __('Quote Button', 'woocommerce-catalog-enquiry'),
//     icon: 'button',
//     category: 'widgets',
//     edit: () => <p>{__('Catalog Quote Button (Visible only on single product pages)', 'woocommerce-catalog-enquiry')}</p>,
//     save: () => <div></div>, // Save is handled by PHP
// });




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('woocommerce-catalog-enquiry/quote-button', {
  title: 'Quote Button',
  icon: 'button',
  category: 'widgets',
  edit() {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, AddToQuote());
  },
  save() {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      className: "add-request-quote-button"
    }, "Add to Quote");
  }
});
const AddToQuote = () => {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    console.log('hiiiii');
    document.addEventListener('click', function (event) {
      if (event.target.closest('.add-request-quote-button')) {
        handleClick(event);
      }
    });
    function handleClick(event) {
      event.preventDefault();
      const productElement = document.querySelector('[data-block-name="woocommerce/single-product"]');
      const productId = productElement ? productElement.dataset.productId : null;
      console.log(productId); // Output the product ID

      const quantityElement = document.querySelector('.quantity .qty');
      const quantity = quantityElement ? quantityElement.value : 1;
      const requestData = new URLSearchParams({
        action: 'quote_added_in_list',
        product_id: productId,
        quantity: quantity,
        quote_action: 'add_item'
      });
      fetch(appLocalizer.ajaxurl, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        body: requestData
      }).then(response => response.json()).then(data => {
        console.log(data); // Handle the response data as needed
      }).catch(error => {
        console.error('Error:', error);
      });
    }
    return () => {
      document.removeEventListener('click', function (event) {
        if (event.target.closest('.add-request-quote-button')) {
          handleClick(event);
        }
      });
    };
  }, []);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "add-request-quote-button"
  }, "Add to Quote");
};
})();

/******/ })()
;
//# sourceMappingURL=index.js.map