import React from 'react';
import { Document, Page, Text, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';



const Invoice = ({ order }) => {
    const styles = StyleSheet.create({
        body: {
          paddingTop: 35,
          paddingBottom: 65,
          paddingHorizontal: 35,
        },
        title: {
          fontSize: 24,
          textAlign: "center",
        },
        author: {
          fontSize: 12,
          textAlign: "center",
          marginBottom: 40,
        },
        subtitle: {
          fontSize: 18,
          margin: 12,
        },
        text: {
          margin: 12,
          fontSize: 14,
          textAlign: "justify",
        },
        image: {
          marginVertical: 15,
          marginHorizontal: 100,
        },
        header: {
          fontSize: 12,
          marginBottom: 20,
          textAlign: "center",
          color: "grey",
        },
        footer: {
          padding: "100px",
          fontSize: 12,
          marginBottom: 20,
          textAlign: "center",
          color: "grey",
        },
        pageNumber: {
          position: "absolute",
          fontSize: 12,
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "grey",
        },
    });


    return (
        <Document>
            <Page style={styles.body}>
                <Text style={styles.title}>ORDER INVOICE</Text>
                <Text style={styles.author}>OFF the MILL</Text>
                <Text style={styles.text}>{new Date(order.created_at).toLocaleDateString('sk-SK')}</Text>

                <Text style={styles.text}>
                    <Text>Order ID: {order.order_id}</Text>
                    <Text>{'\n'}</Text>
                    <Text>Total: ${order.total/100}</Text>
                    <Text>{'\n'}</Text>
                    <Text>Address: {order.address}</Text>
                    <Text>{'\n'}</Text>
                </Text>
                <Text>{'\n'}</Text>

                <Text style={styles.subtitle}>ORDER SUMMARY: </Text>
                <Text style={styles.text}>
                    {
                        order.products.map(product => `${product.count} x $${product.price/100} ${product.title}
                        `)
                    }
                </Text>

                <Text style={styles.footer}>
                    Thank you for your custom. Enjoy your goodies :)
                </Text>
            </Page>
        </Document>
    );
};

export default Invoice;
