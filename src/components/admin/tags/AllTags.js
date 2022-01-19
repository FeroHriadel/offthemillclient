import React, { useState, useEffect, useRef } from 'react';
import { getTags, deleteTag, searchTags } from '../../../actions/tagActions';
import { Spinner, Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { FaTrash, FaHighlighter, FaPlus, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const AllTags = () => {
    //VALUES AND DEFS
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('jfeioewm klefmewkm kekdm ekmfke');
    const [tags, setTags] = useState(null);
    const user = useSelector(state => state.user);
    const alertEl = useRef();
    const navigate = useNavigate();



    //FETCH TAGS
    const fetchTags = async () => {
        setLoading(true);
        setShowError(false);
        const data = await getTags();

        if (!data || data.error) {
            setLoading(false);
            setErrorText(data && data.error ? data.error : 'Fetching Tags failed.');
            setShowError(true);
        } else {
            setLoading(false);
            setShowError(false);
            setTags(data.tags);
        }
    }

    const isMounted = useRef(true); //cleanup
    useEffect(() => {
        if (isMounted) {
            fetchTags();
        }

        return () => isMounted.current = false;
    }, [isMounted])



    //DELETE TAG & MODAL
    const [modalShow, setModalShow] = useState(false);
    const [tagInfo, setTagInfo] = useState({name: '', tag_id: ''});
    
    function scrollToMessage() {
        alertEl.current.scrollIntoView();
    }

    function removeTag(tag_id) {
        setShowError(false);
        setLoading(true);
        setModalShow(false);
        deleteTag(tag_id, user.usertoken)
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    setErrorText(data.error ? data.error : 'Tag delete failed');
                    setShowError(true);
                    scrollToMessage();
                    setTagInfo({name: '', tag_id: ''});
                    setTimeout(() => {
                        setShowError(false);
                    }, 2500);
                } else {
                    let remainingTags = tags.filter(t => t.tag_id !== tag_id);
                    setTags(remainingTags);
                    setLoading(false);
                    setErrorText(data.message);
                    setShowError(true);
                    scrollToMessage();
                    setTagInfo({name: '', tag_id: ''});
                    setTimeout(() => {
                        setShowError(false);
                    }, 2000);
                }
            })
    }

    function DeleteTagModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="delete-tag"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="delete-tag">
                Delete Tag?
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className='text-center'>
              <h5 className='mb-5'>This will permanently remove {tagInfo.name}</h5>
              <Button 
                className='mx-2 btn-danger'
                onClick={() => removeTag(tagInfo.tag_id)}
              >
                Delete
              </Button>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Body>
          </Modal>
        );
    }



    //TAG SEARCH
    const [searchword, setSearchword] = useState('');

    const dispatchSearch = e => {
        e.preventDefault();
        setShowError(false);
        setLoading(true);

        searchTags(searchword)
            .then(data => {
                setLoading(false);
                if (data && data.error) { 
                    setErrorText(data.error);
                    setShowError(true);
                    setTags([]);
                } else {
                    setTags([...data.tags]);
                }
            })
    }



    //TAG SEARCH INPUT RENDERER
    const SearchTagsInput = () => {
        return (
            <Form onSubmit={dispatchSearch} className='mb-5' style={{position: 'relative'}}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" className=''>
                    <Form.Control type="text" placeholder="Search by name..." value={searchword} onChange={e => {setSearchword(e.target.value)}} autoFocus={true} />
                </Form.Group>

                <Button variant="primary" type="submit" style={{height: '48px', width: '20%', position: 'absolute', top: '0', right: '0'}}>
                    <FaSearch style={{position: 'absolute', left: '50%', right: '50%', transform: 'translate(-50%, -50%)'}} />
                </Button>
            </Form>
        )
    }



    //RENDER
    return (
        <div>
            <h4 className='mb-3'>Tag List</h4>
            <h6 className='mb-5'>EDIT AND DELETE TAGS</h6>

            {
                loading
                &&
                <Spinner animation='border' className='my-5'/>
            }

            {
                tags
                &&
                <div className='col-10 offset-1'>
                    <SearchTagsInput />

                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th style={{textAlign: 'left'}}>Tag Name</th>
                                <th>
                                    <FaPlus 
                                        onClick={() => navigate('/admin/tags/create')} 
                                        style={{cursor: 'pointer'}}
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tags.map((tag, idx) => (
                                <tr key={tag.tag_id}>
                                    <td>{idx + 1}</td>
                                    <td style={{textAlign: 'left'}}>{tag.name}</td>
                                    <td>
                                        <FaTrash 
                                            style={{cursor: 'pointer', margin: '5px'}}
                                            onClick={() => {
                                                setTagInfo({name: tag.name, tag_id: tag.tag_id})
                                                setModalShow(true);
                                            }} 
                                        />
                                        <FaHighlighter
                                            style={{cursor: 'pointer', margin: '5px'}} 
                                            onClick={() => navigate(`/admin/tags/edit/${tag.slug}`)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <DeleteTagModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                </div>
            }

            {
                showError
                &&
                <Alert variant='danger mt-3 text-center col-10 offset-1' ref={alertEl}>{errorText}</Alert>
            }

            <Button variant='secondary' className='col-10' onClick={() => navigate('/admin/tags')}>Back to Tags</Button>

        </div>
    )
}

export default AllTags
