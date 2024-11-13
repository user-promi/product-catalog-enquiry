import React from 'react';
const Products = ({ productKey, productItems, deletable }) => {
    
    return (
        <>
            <article key={productKey} className='product-item'>
                <section className='item-meta-wrapper'>
                    <div className='product-img'>
                        <img src="https://shorturl.at/gGILQ" alt="" />
                    </div>
                    <div className='item-meta-data'>
                        <p className='product-name'>{productItems.name}</p>
                        <p className='product-qty'> Qty <span>{productItems.quantity}</span></p>
                    </div>
                </section>
                <section className='product-price'>
                    <div>
                        <p dangerouslySetInnerHTML={{ __html: productItems.price }} />
                        <p className='instock'>{productItems.status}</p>
                    </div>
                    {deletable &&
                        <button className='product-delete-btn'><i className='admin-font adminLib-cross'></i> </button>
                    }
                </section>
            </article>
        </>
    )
}
export default Products;