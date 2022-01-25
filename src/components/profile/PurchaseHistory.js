import React, { useState, useEffect, useRef } from 'react';
import { getUsersOrders } from '../../actions/orderActions';
import { useSelector } from 'react-redux';
import { Spinner, Alert, Card, Button } from 'react-bootstrap';
//import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';



const PurchaseHistory = () => {
    //VARS
    const user = useSelector(state => state.user);
    const isMounted = useRef(true);
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');



    //GET USER'S ORDERS
    useEffect(() => {
        if (isMounted) {
            getUsersOrders(user.usertoken)
                .then(data => {
                    if (data && data.error) {
                        setError(data.error);
                        setLoading(false);
                    } else {
                        setOrders(data.orders);
                        setLoading(false);
                    }
                })
        }

        return () => isMounted.current = false;
    }, [isMounted]);



    //RENDER PDF
    // const styles = StyleSheet.create({
    //     page: {
    //       flexDirection: 'row',
    //       backgroundColor: '#E4E4E4'
    //     },
    //     section: {
    //       margin: 10,
    //       padding: 10,
    //       flexGrow: 1
    //     }
    //   });

    // const renderPDF = () => (
    //     <PDFViewer>
    //         <Document>
    //             <Page size="A4" style={styles.page}>
    //                 <View style={styles.section}>
    //                     <Text>Section 1</Text>
    //                     <Text>Section 2</Text>
    //                 </View>
    //             </Page>
    //         </Document>
    //     </PDFViewer>
    // );



    //RENDER
    return (
        <div className='container'>
            <h4 className='text-center my-5'>Purchase History</h4>

            {
                loading
                &&
                <div className='w-100 text-center'>
                    <Spinner animation='border' />
                </div>
            }

            {
                error
                &&
                <Alert variant='danger'>{error}</Alert>
            }

            {
                !error && !loading && orders
                &&
                orders.map(order => (
                    <Card key={order.order_id} className='d-flex w-100 flex-column align-items-start p-3 mb-3'>
                        
                            <h5 style={{marginBottom: `0`}}>ORDER ID: {order.order_id}</h5>

                            <small style={{fontSize: `0.6rem`}} className='mb-3'>
                                 {new Date(order.created_at).toLocaleTimeString('sk-SK')}, {new Date(order.created_at).toLocaleDateString('sk-SK')} 
                            </small>

                            <div className='d-flex flex-column w-100 align-items-start'>
                                <h5> Items: </h5>
                                {
                                    order.products.map(product => (
                                        <div key={`productid${product.product_id}`}>
                                            <p>
                                                <span>{product.title}</span>
                                                {' '}
                                                <span>{product.count} x ${product.price/100}</span>
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className='row w-100 mb-3'>
                                <div className='col-sm-4'>
                                    <div className='d-flex justify-content-start w-100'>
                                        <h5 style={{textAlign: 'left'}}>TOTAL: ${order.total/100}</h5>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='d-flex justify-content-start w-100'>
                                        <h5 style={{textAlign: 'left'}}>ADDRESS: <span style={{fontSize: `0.75rem`, color: '#55595c'}}>{order.address}</span></h5>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='d-flex justify-content-start w-100'>
                                        <h5 style={{textAlign: 'left'}}>STATUS: <span className='text-info'>{order.status}</span></h5>
                                    </div>
                                </div>
                            </div>

                            <Button variant='primary'>Download PDF</Button>

                            {/*renderPDF()*/}

                    </Card>
                ))
            }
        </div>
    )

};

export default PurchaseHistory;
