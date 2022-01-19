import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { deleteProduct } from '../../../actions/productActions';
import { useNavigate } from 'react-router-dom';



const DeleteProductBtn = ({ product_id, usertoken, setLoading, setBgColor, setToastText, setShowToast }) => {
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);

    const removeProduct = productId => {
        setLoading(true);
        deleteProduct(productId, usertoken)
            .then(data => {
                if (data && data.error) {
                    setBgColor('#f7dddc');
                    setToastText(data.error);
                    setShowToast(true);
                    setLoading(false);
                    setTimeout(() => {setShowToast(false)}, 3000);
                } else {
                    setBgColor('#aaa');
                    setToastText('Product Deleted. Redirecting...');
                    setShowToast(true);
                    setTimeout(() => {navigate(-1)}, 2500)
                }
            })
    }

    const DeleteProductModal = (props) => (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="delete-tag"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title id="delete-product">
                Delete Product?
            </Modal.Title>
            </Modal.Header>

            <Modal.Body className='text-center'>
                <h5 className='mb-5'>This will permanently remove this product</h5>

                <Button 
                    className='mx-2 btn-danger'
                    onClick={() => removeProduct(product_id)}
                >
                    Delete
                </Button>
                
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Body>
          </Modal>
    )

    return (
        <div className='text-center w-100'>
            <Button variant='primary' className='mt-1 mb-5' onClick={() => setModalShow(true)}>
                Delete this product
                {' '}
                <FaTrash style={{transform: 'translateY(-2.5px)'}} />
            </Button>

            <DeleteProductModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            ></DeleteProductModal>
        </div>
    )
}

export default DeleteProductBtn
