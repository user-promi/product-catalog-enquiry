import React, { useState, useEffect, useRef } from 'react';
import './CatalogCustomizer.scss';
import ButtonCustomizer from '../AdminLibrary/Inputs/Special/ButtonCustomizer';
import SubTabSection from '../SubTabSection/SubTabSection';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSetting } from '../../contexts/SettingContext';
import Sample_Product from '../../assets/images/sample-product.jpg';

const ButtonDND = (props) => {
  // Readable settings
  const { setting, updateSetting } = useSetting();

  const possitionSetting = setting['shop_page_button_position_setting'] || [];

  console.log(props.currentTab.id); // Log currentTab here
  const [buttonItems, setButtonItems] = useState([]);

  const handleMenuChange = (set, get)=>{
    console.log(set + get)
  }

  useEffect(() => {
    setButtonItems([
      {
        id: 'enquery_button',
        content: (
          <div className={props.currentTab.id == "enquiry" ? '' : 'disable'}>
            <ButtonCustomizer text='enquiry' />
          </div>
        ),
      },
      {
        id: 'cart_button',
        content: (
            <ButtonCustomizer text='Add to cart' />
        ),
      },
      {
        id: 'quote_button',
        content: (
          <div onClick={()=>handleMenuChange(props.currentTab.id, 'quote')} className={props.currentTab.id == "quote" ? '' : 'disable'}>
            <ButtonCustomizer text='Add to quote' />
          </div>
        ),
      },
      {
        id: 'enquery_cart_button',
        content: (
          <div className={props.currentTab.id == "enquiry_cart" ? '' : 'disable'}>
            <ButtonCustomizer text='Add to enquiry cart' />
          </div>
        ),
      }
    ])
  }, [props.currentTab.id])

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  useEffect(() => {
    setButtonItems((buttonItems) => {
      buttonItems.sort((a, b) => possitionSetting.indexOf(a.id) - possitionSetting.indexOf(b.id));
      return buttonItems;
    });
  }, []);

  const onButtonDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(buttonItems, result.source.index, result.destination.index);

    // Calculate position for dragable items.
    const position = newItems.map(item => item.id);
    props.onChange('shop_page_button_position_setting', position);

    setButtonItems(newItems);
  }

  return (
    <div className='button-wrapper'>
      <DragDropContext onDragEnd={onButtonDragEnd}>
        <Droppable direction='horizontal' droppableId='buttonDroppable'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {buttonItems.map((item, index) => (
                <>
                  {
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  }
                </>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


const CatalogCustomizer = (props) => {
  const { setting, updateSetting } = useSetting();
  
  const [menu, setMenu] = useState([
    {
      name: "Enquiry", link: "hi", id: 'enquiry', icon: 'font-info',
      setting: [
        {
          name: 'Display Enquiry form via popup',
          id: 'is_disable_popup',
          type: 'checkbox',
          description: "By default the form will be displayed via popup. Enable this, if you want to display the form below the product description."
        },
        {
          name: 'Redirect after Enquiry form Submission',
          id: 'is_page_redirect',
          type: 'checkbox',
          description: "Enable this to redirect user to another page after successful enquiry submission."
        },
      ]
    },
    {
      name: "Enquiry Cart", link: "hi", id: 'enquiry_cart', icon: 'font-store',
      setting: [
        {
          name: 'Enable Multiple Enquiry Cart',
          id: 'is_enable_multiple_product_enquiry',
          type: 'checkbox',
          description: "Enable this checkbox to allow multiple product enquiry via enquiry cart. Also multiple enquiry product displays on the cart"
        },
      ]
    },
    {
      name: "Quote", link: "hi", id: 'quote', icon: 'font-payment',
      // setting: [
      //   { name: 'name1', id: 2, value: 3, description: "Allow backorder subscription" },
      // ]
    },
    {
      name: "Catalog", link: "catalog", id: 'catalog', icon: 'font-payment',
      // setting: [
      //   { name: 'name1', id: 2, value: 3, description: "Allow backorder subscription" },
      // ]
    },
  ]);

  const [currentTab, setCurrentTab] = useState(menu[0]);

  /**
   * Get the index of list item by id.
   * @param {*} list 
   * @param {*} id 
   * @returns 
   */
  const getIndex = (list, id) => {
    let foundItemIndex = -1;

    list.forEach((item, index) => {
      if (item.id === id) {
        foundItemIndex = index;
      }
    });

    return foundItemIndex;
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Create default dragand drop items.
  const [dragableItems, setDragableItems] = useState([
    {
      id: 'price_section',
      content: () => (
        <div className='price-section'>
          <p className='product-price'><span className='strikethrough'>$20.00</span> $18.00</p>
        </div>
      ),
      defaultPosition: 0,
      dragable: false,
    },
    {
      id: 'product_description',
      content: () => (
        <div className='description-section'>
          <p className='product-description'>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
        </div>
      ),
      defaultPosition: 1,
      dragable: false,
    },
    {
      id: 'additional_input',
      content: (props) => (
        <div className={`additional-input ${props.currentTab.id === 'catalog' ? '' : 'disable'}`}>
          <input placeholder='Additional input(optional)' type='text' />
        </div>
      ),
      defaultPosition: 2,
      dragable: true,
    },
    {
      id: 'custom_button',
      content: (props) => (
        <ButtonDND
          setting={props.setting}
          onChange={props.onChange}
          currentTab = {props.currentTab}
        />
      ),
      defaultPosition: 3,
      dragable: true,
    },
    {
      id: 'sku_category',
      content: () => (
        <div className='product-sku-category'>
          <p>SKU: <span>WOO-ALBUM</span></p>
          <p>Category: <span>Music</span></p>
        </div>
      ),
      defaultPosition: 4,
      dragable: false,
    },
  ]);

  const shopPagePossitionSetting = props.setting['shop_page_possition_setting'];

  useEffect(() => {

    let possitionSetting = shopPagePossitionSetting || {};
    let items = [...dragableItems];

    possitionSetting = Object.entries(possitionSetting);

    // Check they are going in same position
    let samePosition = true;
    let possitionToMove = null;
    possitionSetting.forEach(([willMove, moveAfter]) => {
      moveAfter;

      if (possitionToMove !== null && possitionToMove != moveAfter) {
        samePosition = false;
      }

      possitionToMove = moveAfter;
    });

    possitionSetting.forEach(([willMove, moveAfter]) => {
      let startIndex = getIndex(items, willMove);
      let endIndex = getIndex(items, moveAfter) + 1;

      // If they are in same position insert it to the last this maintain the sequence properly
      if (samePosition && possitionToMove !== null) {
        endIndex = items.length;
      }

      items = reorder(items, startIndex, endIndex);
    });

    // Take action when movable elements are in same position
    if (samePosition && possitionToMove !== null) {
      const movedElements = items.splice(items.length - 2, 2);

      // Find index where the moved element get position
      const movedIndex = getIndex(items, possitionSetting[0][1]) + 1;

      // Create new sequence of items
      items = [...items.slice(0, movedIndex), ...movedElements, ...items.slice(movedIndex)]
    }

    setDragableItems(items);

  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(dragableItems, result.source.index, result.destination.index);

    // Calculate position for dragable items.
    const shopPageBildersPosition = {};
    let positionAfter = '';

    newItems.forEach((item, index) => {
      if (item.dragable) {
        shopPageBildersPosition[item.id] = positionAfter;
      } else {
        positionAfter = item.id;
      }
    });

    props.onChange('shop_page_possition_setting', shopPageBildersPosition);

    setDragableItems(newItems);
  };

  return (
    <>
      <SubTabSection
        menuitem={menu}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setting={setting}
        updateSetting={updateSetting}
        onChange={props.onChange}
      />
      <section className='catelog-customizer'>
        <div className='product-img'>
          <img src={Sample_Product} alt="" />
        </div>
        <div className='product-data'>
          <h1 className='product-name'>V-Neck T-Shirt</h1>
          <div className='drag-drop-component'>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='droppable'>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {dragableItems.map((item, index) => (
                      <>
                        {
                          <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!item.dragable}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <item.content currentTab={currentTab} />
                              </div>
                            )}
                          </Draggable>
                        }
                      </>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </section>
      <section className='single-product-page-description'>
        <div className='option'>
          <ul>
            <li className='active'>Description <span><i className='admin-font font-keyboard_arrow_down'></i></span></li>
            <li>Additional Information</li>
            <li>Review</li>
          </ul>
        </div>
        <div className='description'>
          <h2>Description</h2>
          <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
        </div>
      </section>
    </>
  )
}

export default CatalogCustomizer;
