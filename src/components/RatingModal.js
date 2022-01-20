import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import StarRating from 'react-star-ratings';
import { useSelector } from 'react-redux';
import { createReview } from '../actions/reviewActions';



const RatingModal = ({ modalShow, setModalShow, setReloadReviews, product_id, ...props }) => {
    //VALUES
    const user = useSelector(state => state.user);
    const [review, setReview] = useState({stars: 0, comment: ''});
    const [blockForm, setBlockForm] = useState(false);
    const [message, setMessage] = useState('');



    //STARS ON CHANGE HANDLER
    const changeRating = (newRating, name) => {
        //console.log(name, newRating);
        setMessage('');
        setReview({...review, stars: newRating});
    }



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (blockForm) return;
        if (review.stars < 1 || review.stars > 5) {
            setMessage('Please rate the product (click stars)');
            return;
        }

        setBlockForm(true);
        setMessage('Submitting your review. One second, please...');
        createReview(review, product_id, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setMessage(data.error);
                    setBlockForm(false);
                }
                else {
                    setMessage('Thank you for your review. Closing...');
                    setReloadReviews(true);
                    setBlockForm(false);
                    setTimeout(() => {
                        setMessage('');
                        setModalShow(false)
                    }, 2500)
                }
            })
    }



    //RENDER
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Review
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Your rating: </Form.Label>
                        <br />
                        <StarRating 
                            name='stars' 
                            starRatedColor='orange' 
                            changeRating={changeRating}
                            numberOfStars={5}
                            starDimension='20px'
                            starSpacing='2px'
                            rating={review.stars}
                        />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Your comment: </Form.Label>
                        <br/>
                        <Form.Control 
                            as='textarea'
                            style={{height: `100px`}}
                            name='comment'
                            onChange={(e) => {setMessage(''); setReview({...review, comment: e.target.value})}}
                        />
                    </Form.Group>

                    {message && <p className='text-danger text-center'>{message}</p>}

                    <Form.Group className='mb-3'>
                        <Button type='submit' variant='primary' className='col-12'>Submit</Button>
                    </Form.Group>
                </Form>

                {/*<Button onClick={props.onHide}>Close</Button>*/}
            </Modal.Body>
        </Modal>
    );
};

export default RatingModal;
