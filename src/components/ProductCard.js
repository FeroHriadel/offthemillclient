import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaEye, FaShoppingCart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';



const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addProductToCart } = useCart();

    return (
        <Card style={{width: `320px`, minWidth: `240px`, margin: `0.5rem`, borderRadius: '5px', boxShadow: `-2.5px 2.5px 7.5px #666`}}>
            <Card.Body>
                <div 
                    style={product && product.images[0] !== null 
                        ? 
                        {background: `url(${product.images[0]}) no-repeat center center/cover`, height: '200px', width: '100%', borderRadius: `5px`, marginBottom: `0.5rem`} 
                        : 
                        {background: `linear-gradient(to left bottom, #ccc, #eee)`, height: '200px', width: '100%', borderRadius: `5px`, marginBottom: `0.5rem`}}
                />

                <h6 className='d-flex w-100 text-muted'>{product.category_name}</h6>

                <div className='d-flex justify-content-between w-100'>
                    <h3 style={{cursor: 'pointer'}} onClick={() => navigate(`/products/${product.slug}`)}>
                        <FaEye />
                    </h3>

                    <h3>${product.price/100}</h3>
                </div>

                <div className='w-100 d-flex flex-wrap' style={{height: `25px`}}>
                    {
                        product.tags && product.tags[0] !== null
                        &&
                        product.tags.map(tag => (
                            <h6 className='mr-1' key={`tag${tag}`}>
                                <Badge bg="primary">{tag}</Badge>
                            </h6>
                        ))
                    }
                </div>

                <Card.Title className='d-flex w-100'>{product.title}</Card.Title>
                
                <Card.Text style={{height: `75px`}} className='d-flex w-100'>
                    {product && product.description ? `${product.description.substring(0, 50)}...` : `No description provided`}
                </Card.Text>

                <Button variant='dark' className='col-12' onClick={() => addProductToCart(product)}>
                    <FaShoppingCart style={{transform: `translateY(-2.5px)`}}/> Add to Cart
                </Button>
            </Card.Body>
        </Card>
    )
}

export default ProductCard
