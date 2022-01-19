import React, { useState, useEffect, useRef } from 'react';
import { getCategories, deleteCategory, searchCategories } from '../../../actions/categoryActions';
import { Spinner, Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { FaTrash, FaHighlighter, FaPlus, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const AllCategories = () => {
    //VALUES AND DEFS
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('jfeioewm klefmewkm kekdm ekmfke');
    const [categories, setCategories] = useState(null);
    const user = useSelector(state => state.user);
    const alertEl = useRef();
    const navigate = useNavigate();



    //FETCH CATEGORIES
    const fetchCategories = async () => {
        setLoading(true);
        setShowError(false);
        const data = await getCategories();

        if (!data || data.error) {
            setLoading(false);
            setErrorText(data && data.error ? data.error : 'Fetching Categories failed.');
            setShowError(true);
        } else {
            setLoading(false);
            setShowError(false);
            setCategories(data.categories);
        }
    }

    const isMounted = useRef(true); //clean up after async func in useEffect
    useEffect(() => {
        if (isMounted) {
            fetchCategories();
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //DELETE CATEGORY & MODAL
    const [modalShow, setModalShow] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState({name: '', category_id: ''});
    
    function scrollToMessage() {
        alertEl.current.scrollIntoView();
    }

    function removeCategory(category_id) {
        setShowError(false);
        setLoading(true);
        setModalShow(false);
        deleteCategory(category_id, user.usertoken)
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    setErrorText(data.error ? data.error : 'Category delete failed');
                    setShowError(true);
                    scrollToMessage();
                    setCategoryInfo({name: '', category_id: ''});
                    setTimeout(() => {
                        setShowError(false);
                    }, 2500);
                } else {
                    let remainingCategories = categories.filter(c => c.category_id !== category_id);
                    setCategories(remainingCategories);
                    setLoading(false);
                    setErrorText(data.message);
                    setShowError(true);
                    scrollToMessage();
                    setCategoryInfo({name: '', category_id: ''});
                    setTimeout(() => {
                        setShowError(false);
                    }, 2000);
                }
            })
    }

    function DeleteCategoryModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="delete-category"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="delete-category">
                Delete Category?
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className='text-center'>
              <h5 className='mb-5'>This will permanently remove {categoryInfo.name}</h5>
              <Button 
                className='mx-2 btn-danger'
                onClick={() => removeCategory(categoryInfo.category_id)}
              >
                Delete
              </Button>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Body>
          </Modal>
        );
    }



    //CATEGORY SEARCH
    const [searchword, setSearchword] = useState('');

    const dispatchSearch = e => {
        e.preventDefault();
        setShowError(false);
        setLoading(true);

        searchCategories(searchword)
            .then(data => {
                setLoading(false);
                if (data && data.error) { 
                    setErrorText(data.error);
                    setShowError(true);
                    setCategories([]);
                } else {
                    setCategories([...data.categories]);
                }
            })
    }



    //CATEGORY SEARCH INPUT RENDERER
    const SearchCategoriesInput = () => {
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
            <h4 className='mb-3'>Category List</h4>
            <h6 className='mb-5'>EDIT AND DELETE CATEGORIES</h6>

            {
                loading
                &&
                <Spinner animation='border' className='my-5'/>
            }

            {
                categories 
                &&
                <div className='col-10 offset-1'>
                    <SearchCategoriesInput />

                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th style={{textAlign: 'left'}}>Category Name</th>
                                <th>
                                    <FaPlus 
                                        onClick={() => navigate('/admin/categories/create')} 
                                        style={{cursor: 'pointer'}}
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.map((category, idx) => (
                                <tr key={category.category_id}>
                                    <td>{idx + 1}</td>
                                    <td style={{textAlign: 'left'}}>{category.name}</td>
                                    <td>
                                        <FaTrash 
                                            style={{cursor: 'pointer', margin: '5px'}}
                                            onClick={() => {
                                                setCategoryInfo({name: category.name, category_id: category.category_id})
                                                setModalShow(true);
                                            }} 
                                        />
                                        <FaHighlighter
                                            style={{cursor: 'pointer', margin: '5px'}} 
                                            onClick={() => navigate(`/admin/categories/edit/${category.slug}`)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <DeleteCategoryModal
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

            <Button variant='secondary' className='col-10' onClick={() => navigate('/admin/categories')}>Back to Categories</Button>

        </div>
    )
}

export default AllCategories

/*
    const SearchCategoriesInput = () => {
        return (
            <Form onSubmit={dispatchSearch} className='mb-5'>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Search Categories</Form.Label>
                    <Form.Control type="text" placeholder="Search by name..." value={searchword} onChange={e => {setSearchword(e.target.value)}} autoFocus={true} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        )
    }
*/