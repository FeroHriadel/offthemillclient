import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const WishlistItem = ({ product, setWishToRemove }) => {

    return (
        <React.Fragment>
            <Card className='m-1'>
                <Card.Body>
                    <div 
                        style={{
                            background: product.images && product.images[0] == null ? `linear-gradient(to bottom left, #eee, #ccc)` : `url(${product.images[0]}) no-repeat center center/cover`,
                            width: `100%`,
                            height: `250px`,
                            marginBottom: `0.5rem`
                        }}
                    />
                    <Card.Title>{product.title}</Card.Title>

                    <Card.Text className="mb-2 text-muted">
                        <Link to={`/products/${product.slug}`} style={{textDecoration: `none`}}>
                            See details
                        </Link>
                    </Card.Text>

                    <Card.Subtitle 
                        style={{marginTop: `0.25rem`, fontSize: `0.65rem`, cursor: `pointer`}} 
                        className='text-muted'
                        onClick={() => setWishToRemove(product.wish_id)}
                    >
                        REMOVE
                    </Card.Subtitle>
                </Card.Body>
            </Card>
        </React.Fragment>
    )

};

export default WishlistItem;
