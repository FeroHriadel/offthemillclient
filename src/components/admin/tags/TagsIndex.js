import React from 'react';
import { Link } from 'react-router-dom';



const TagsIndex = () => {
    return (
        <React.Fragment>
            <h4 className='mb-3'>Tags</h4>
            <div className='d-flex flex-column align-items-center'>
                <Link className='admin-index-link' to='/admin/tags/create'>Add new Tag</Link>
                <Link className='admin-index-link' to='/admin/tags/all'>Show all Tags</Link>
                <Link className='admin-index-link' to='/admin/tags/all'>Edit Tags</Link>
                <Link className='admin-index-link' to='/admin/tags/all'>Delete Tags</Link>
            </div>
        </React.Fragment>
    )
}

export default TagsIndex
