import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner, Alert, Form, Button } from 'react-bootstrap';
import { getTag, updateTag } from '../../../actions/tagActions';
import { useSelector } from 'react-redux';



const EditTag = () => {
    //VARS AND DEFS
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [tag, setTag] = useState(null);
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    


    //GET TAG
    const params = useParams();
    const tagSlug = params.slug;
    const isMounted = useRef(true); //cleanup

    useEffect(() => {
        if (isMounted) {
            getTag(tagSlug)
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    setErrorText(data && data.error ? data.error : 'Something went wrong. Tag NOT found');
                    setShowError(true);
                } else {
                    setShowError(false);
                    setLoading(false);
                    setTag(data.tag);
                }
            })
        }

        return () => isMounted.current = false;
    }, [tagSlug, isMounted]);



    //SUBMIT HANDLER
    const handleSubmit = e => {
        e.preventDefault();
        if (!tag.name || tag.name.trim() === '') {
            setErrorText('Tag must have a name');
            setShowError(true);
            return
        }

        if (isMounted) {
            updateTag(tag.name, tagSlug, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setErrorText(data.error);
                    setShowError(true);
                } else {
                    setShowError(false);
                    setErrorText('Tag updated');
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 2000)
                }
            })
        }
    }



    //RENDER
    return (
        <div className='col-10 offset-1'>
            {
                loading && <Spinner animation='border' />
            }

            {
                tag
                &&
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>New Tag Name</Form.Label>
                        <Form.Control type="text" placeholder="New name" value={tag.name} onChange={(e) => {setShowError(false); setTag({...tag, name: e.target.value})}}/>
                    </Form.Group>

                    <Button variant="primary" type="submit" className='col-12'>
                        Submit
                    </Button>
                </Form>
            }

            <Button 
                variant='secondary' 
                onClick={() => navigate('/admin/tags')}
                className='mt-3 col-12'
            >
                Back to Tags
            </Button>

            {
                showError
                &&
                <Alert variant='danger' className='mt-3'>{errorText}</Alert>
            }

            {
                showSuccess
                &&
                <Alert variant='primary' className='mt-3'>{errorText}</Alert>
            }
        </div>
    )
}

export default EditTag
