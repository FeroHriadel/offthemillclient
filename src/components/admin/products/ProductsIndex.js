import React from 'react';
import { Link } from 'react-router-dom';



const CategoriesIndex = () => {
    return (
        <React.Fragment>
            <h4 className='mb-3'>PRODUCTS</h4>
            <div className='d-flex flex-column align-items-center'>
                <Link className='admin-index-link' to='/admin/products/create'>Add new Product</Link>
                <Link className='admin-index-link' to='/admin/products/all'>Show all Products</Link>
                <Link className='admin-index-link' to='/admin/products/all'>Edit Products</Link>
                <Link className='admin-index-link' to='/admin/products/all'>Delete Products</Link>
            </div>
        </React.Fragment>
    )
}

export default CategoriesIndex