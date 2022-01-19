import React from 'react';
import { Link } from 'react-router-dom';



const CategoriesIndex = () => {
    return (
        <React.Fragment>
            <h4 className='mb-3'>CATEGORIES</h4>
            <div className='d-flex flex-column align-items-center'>
                <Link className='admin-index-link' to='/admin/categories/create'>Add new Category</Link>
                <Link className='admin-index-link' to='/admin/categories/all'>Show all Categories</Link>
                <Link className='admin-index-link' to='/admin/categories/all'>Edit Categories</Link>
                <Link className='admin-index-link' to='/admin/categories/all'>Delete Categories</Link>
            </div>
        </React.Fragment>
    )
}

export default CategoriesIndex
