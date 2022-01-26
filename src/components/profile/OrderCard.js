import React, { useState } from 'react';
import { Card, Button, Dropdown } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
// import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'  => if you want to render pdf in your app
import Invoice from './Invoice';
import { useSelector } from 'react-redux';
import { updateStatus, updateToPaid } from '../../actions/orderActions';
import ToastMessage from '../ToastMessage';
import PaidStamp from './PaidStamp';




const OrderCard = ({ order }) => {
    //VARIABLES
    const user = useSelector(state => state.user);



    // RENDER PDF
    //   if you want to show pdf in your app
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

    //   if you want to show pdf in your app
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



    //DOWNLOAD PDF
    const downloadPDF = (order) => (
        <PDFDownloadLink 
            document={<Invoice order={order}/>}
            fileName='invoice.pdf'
        >
            <p style={{color: 'white', padding: `0`, margin: `0`}}>Download PDF</p>
        </PDFDownloadLink>
    )



    //TOAST
    const red = '#f7dddc';
    const gray = '#aaa'
    const [showToast, setShowToast] = useState(false);
    const [toastText, setToastText] = useState('lorem ipsum doler sunt');
    const [bgColor, setBgColor] = useState(gray);



    //CHANGE ORDER STATUS
    const [status, setStatus] = useState(order.status);

    const changeStatus = (newStatus) => {
        updateStatus(order.order_id, newStatus, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setBgColor(red);
                    setToastText(`Error. Status was NOT updated. ${data.error}`);
                    setShowToast(true);
                    setTimeout(() => {setShowToast(false)}, 3000);
                } else {
                    setBgColor(gray);
                    setToastText('Status updated');
                    setShowToast(true);
                    setStatus(data.order.status);
                    setTimeout(() => {setShowToast(false)}, 2000);
                }
            })
    }



    //UPDATE TO PAID
    const updateOrderToPaid = (orderId) => {
        updateToPaid(orderId, user.usertoken)
            .then(data => {
                if (data && data.error) {
                    setBgColor(red);
                    setToastText(data.error);
                    setShowToast(true);
                    setTimeout(() => {setShowToast(false)}, 3000);
                } else {
                    setBgColor(gray);
                    setToastText('Updated to PAID');
                    setShowToast(true);
                    setTimeout(() => {setShowToast(false)}, 2000);
                    order.paid = true; //??? eh, I guess it's ok. order.paid in parent won't change but next time order is reloaded it will be coming from db so it will show order.paid = true even if I don't change the order.paid in parent from here
                }
            })
    }



    //RENDER
    return (
        <React.Fragment>
            <Card className='d-flex w-100 flex-column align-items-start p-3 mb-3' style={{position: `relative`}}>
                            
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
                            <h5 style={{textAlign: 'left'}}>STATUS: <span className='text-info'>{status}</span></h5>
                        </div>
                    </div>
                </div>



                {/* Buttons */}
                <div className='d-flex flex-wrap'>
                    <Button variant='primary' style={{width: '180px'}} className='m-1'>
                        {downloadPDF(order)}
                    </Button>

                    {
                        user && user.role === 'admin'
                        &&
                        <Dropdown className='m-1'>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{width: '180px'}}>
                                Change Status
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => changeStatus('new order')}>New Order</Dropdown.Item>
                                <Dropdown.Item onClick={() => changeStatus('sent')}>Sent</Dropdown.Item>
                                <Dropdown.Item onClick={() => changeStatus('delivered')}>Delivered</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }

                    {
                        user && user.role === 'admin' && !order.paid
                        &&
                        <Button variant='primary' style={{width: '180px'}} className='m-1' onClick={() => updateOrderToPaid(order.order_id)}>
                            Update To Paid
                        </Button>
                    }
                </div>

                { order.paid && <PaidStamp />}

                {/*renderPDF()   //if you want to show pdf in your app*/}
            </Card>

            <ToastMessage showToast={showToast} setShowToast={setShowToast} toastText={toastText} bgColor={bgColor} />
        </React.Fragment>
    );
};

export default OrderCard;
