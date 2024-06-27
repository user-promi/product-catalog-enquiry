import React, { useState, useEffect, useRef } from 'react';
import './CatalogCustomizer.scss';
import ButtonCustomizer from '../AdminLibrary/Inputs/Special/ButtonCustomizer';
import SubTabSection from '../SubTabSection/SubTabSection';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSetting } from '../../contexts/SettingContext';

const ButtonDND = (props) => {
  // Readable settings
  const { setting } = useSetting();
  
  const possitionSetting = setting['shop_page_button_position_setting'] || [];

  const [buttonItems, setButtonItems] = useState([
    {
      id: 'enquery_button',
      content: (
        <ButtonCustomizer text='enquiry' />
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
        <ButtonCustomizer text='Add to quote' />
      ),
    }
  ]);

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
    const position = newItems.map( item => item.id );
    props.onChange( 'shop_page_button_position_setting', position );

    setButtonItems(newItems);
  }

  return (
    <DragDropContext onDragEnd={onButtonDragEnd}>
      <Droppable droppableId='buttonDroppable'>
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
  );
}


const CatalogCustomizer = (props) => {
  const [currentTab, setCurrentTab] = useState('');

  const [menu, setMenu] = useState([
    {
      name: "Enquiry", link: "hi", id: 'enquiry', icon: 'font-info',
      setting: [
        {
          name: 'Display Enquiry form via popup',
          id: 'is_disable_popup',
          type: 'checkbox',
          value: 'is_disable_popup',
          description: "By default the form will be displayed via popup. Enable this, if you want to display the form below the product description."
        },
        {
          name: 'Redirect after Enquiry form Submission',
          id: 'is_page_redirect',
          value: 'is_page_redirect',
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
          value: 'is_enable_multiple_product_enquiry',
          type: 'checkbox',
          description: "Enable this checkbox to allow multiple product enquiry via enquiry cart. Also multiple enquiry product displays on the cart"
        },
      ]
    },
    {
      name: "Quote", link: "hi", id: 'quote', icon: 'font-payment',
      setting: [
        { name: 'name1', id: 2, value: 3, description: "Allow backorder subscription" },
      ]
    },
  ]);

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
          <p className='product-price'>₹15.00 – ₹20.00</p>
        </div>
      ),
      defaultPosition: 0,
      dragable: false,
    },
    {
      id: 'product_description',
      content: () => (
        <div className='description-section'>
          <p className='product-description'>This is a variable product.</p>
        </div>
      ),
      defaultPosition: 1,
      dragable: false,
    },
    {
      id: 'additional_input',
      content: () => (
        <div className='additional-input' style={{padding:"10px"}}>
          <input placeholder='Additional input(optional)' type='text' />
        </div>
      ),
      defaultPosition: 2,
      dragable: true,
    },
    {
      id: 'custom_button',
      content: () => (
        <ButtonDND
          setting={props.setting}
          onChange={props.onChange}
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
    let samePosition    = true;
    let possitionToMove = null; 
    possitionSetting.forEach(([willMove, moveAfter]) => {
      moveAfter;

      if ( possitionToMove !== null && possitionToMove != moveAfter ) {
        samePosition = false;
      }
      
      possitionToMove = moveAfter;
    });

    possitionSetting.forEach(([willMove, moveAfter]) => {
      let startIndex = getIndex(items, willMove);
      let endIndex   = getIndex(items, moveAfter) + 1;

      // If they are in same position insert it to the last this maintain the sequence properly
      if (samePosition && possitionToMove !== null ) {
        endIndex = items.length;  
      }

      items = reorder( items, startIndex, endIndex );
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
      <SubTabSection menuitem={menu} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <section className='catelog-customizer'>
        <div className='product-img'>
          <img src="https://rb.gy/owvfpe" alt="" />
        </div>
        <div className='product-data'>
          <h1 className='product-name'>V-Neck T-Shirt</h1>
          <div className='drag-drop-component'>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='droppable'>
                {(provided) => (
                  <div className='new' {...provided.droppableProps} ref={provided.innerRef}>
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
                                <item.content />
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
    </>
  )
}

export default CatalogCustomizer;
