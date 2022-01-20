import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import StarRating from 'react-star-ratings';
import { useSelector } from 'react-redux';
import { getReview, updateReview, deleteReview } from '../actions/reviewActions';



const RatingModalEdit = ({ modalShow, setEditModalShow, setReloadReviews, review_id, ...props}) => {
    //VALUES
    const user = useSelector(state => state.user);
    const [review, setReview] = useState({stars: 0, comment: ''});
    const [blockForm, setBlockForm] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);



    //GET REVIEW
    useEffect(() => {
        if (isMounted && review_id) {
            getReview(review_id)
                .then(data => {
                    if (data && data.error) {
                        console.log(data.error);
                    } else {;
                        setReview({stars: data.review.stars, comment: data.review.comment});
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted, review_id])



    //STARS ON CHANGE HANDLER
    const changeRating = (newRating, name) => {
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
        setMessage('Editing review. One second, please...');
        if (isMounted) {
            updateReview(review.stars, review.comment, review_id, user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setMessage(data.error);
                        setBlockForm(false);
                    } else {
                        setMessage('Review updated');
                        setReloadReviews(true);
                        setBlockForm(false);
                        setTimeout(() => {setMessage('')}, 2500);
                    }
                })
        }
    }



    //DELETE REVIEW
    const removeReview = () => {
        if (isMounted) {
            setMessage('Deleting review...');
            setBlockForm(true);
            deleteReview(review_id, user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setMessage(data.error, 'Review NOT deleted');
                        setTimeout(() => {setMessage('')}, 3000)
                    } else {
                        setMessage('Review deleted. Closing...');
                        setReview({stars: 0, comment: ''});
                        setBlockForm(false);
                        setReloadReviews(true);
                        setTimeout(() => {
                            setMessage('');
                            setBlockForm(false);
                            setEditModalShow(false);
                        }, 2500);
                    }
                })
        }
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
                    Edit Review
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {
                    loading
                    ?
                    <div className='w-100 text-center'>
                        <Spinner animation='border' />
                    </div>
                    :
                    <React.Fragment>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Rating: </Form.Label>
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
                                <Form.Label>Comment: </Form.Label>
                                <br/>
                                <Form.Control 
                                    as='textarea'
                                    style={{height: `100px`}}
                                    name='comment'
                                    onChange={(e) => {setMessage(''); setReview({...review, comment: e.target.value})}}
                                    value={review.comment == null ? '' : review.comment}
                                />
                            </Form.Group>

                            {message && <p className='text-danger text-center'>{message}</p>}

                            <Form.Group className='mb-3'>
                                <Button type='submit' variant='primary' className='col-12'>Submit</Button>
                            </Form.Group>
                        </Form>
                            
                        <Button variant='primary' className='col-12' onClick={() => removeReview()}>Delete Review</Button>
                    </React.Fragment>
                }

                {/*<Button onClick={props.onHide}>Close</Button>*/}
            </Modal.Body>
        </Modal>
    );
};

export default RatingModalEdit;

