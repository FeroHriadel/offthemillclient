import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';


const OrderSearch = ({ orderId, setOrderId, address, setAddress, searchById, searchByAddress }) => {
    const [showIdSearch, setShowIdSearch] = useState(false);
    const [showAddressSearch, setShowAddressSearch] = useState(false);



    return (
      <div className='d-flex flex-column align-items-center w-100 my-5'>

          {/* Search by orderId */}
          <p style={{cursor: `pointer`, margin: `0 0 0.5rem 0`, padding: `0`}} onClick={() => {
            setShowIdSearch(!showIdSearch);
            setShowAddressSearch(false);
            setAddress(null);
          }}
          >
            Search by Order ID
          </p>
          {
            showIdSearch
            &&
            <div className='mb-3 d-flex' style={{position: `relative`}}>
              <input
                type="text"
                placeholder='Enter Order ID'
                name='orderId'
                value={orderId === null ? '' : orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={{
                  height: `3rem`,
                  outline: `0`,
                  border: `0`,
                  textIndent: `5px`,
                  width: `240px`
                }}
              />
              <Button variant='primary' style={{position: `absolute`, right: `0`, top: `0`}} onClick={() => searchById()}>
                <p style={{margin: `0`, padding: `0`}}> <FaSearch /> </p>
              </Button>
            </div>
          }



          {/* Search by Address */}
          <p style={{cursor: `pointer`, margin: `0 0 0.5rem 0`, padding: `0`}} onClick={() => {
            setShowAddressSearch(!showAddressSearch);
            setShowIdSearch(false);
            setOrderId(null);
          }}
          >
            Search by Address
          </p>
          {
            showAddressSearch
            &&
            <div className='mb-3 d-flex' style={{position: `relative`}}>
              <input
                type="text"
                placeholder='Enter part of Address'
                name='address'
                value={address === null ? '' : address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  height: `3rem`,
                  outline: `0`,
                  border: `0`,
                  textIndent: `5px`,
                  width: `240px`
                }}
              />
              <Button variant='primary' style={{position: `absolute`, right: `0`, top: `0`}} onClick={() => searchByAddress()}>
                <p style={{margin: `0`, padding: `0`}}> <FaSearch /> </p>
              </Button>
            </div>
          }



          {/* Search all */}
          <p style={{cursor: `pointer`, margin: `0 0 0.5rem 0`, padding: `0`}} onClick={() => {
            window.location.reload();
          }}
          >
            Show All
          </p>
      </div>
    )
};

export default OrderSearch;
