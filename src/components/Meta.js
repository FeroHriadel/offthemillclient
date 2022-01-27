import React from 'react';
import { Helmet } from 'react-helmet';
import grapefruitPng from '../images/grapefruit.png'



//Only use this in pages you want SEO friendly. Admin pages do not want to have this
/*
import Meta from '../components/Meta';

return (
    <Meta title='Off the Mill' description='Goodies you love' ogTitle='Off the Mill | Goodies' ogDescription='Goodies you love' />
)
*/

const Meta = ({ title, description, ogTitle, ogDescription }) => {
    return (
        <Helmet>
            <title>{title}</title>

            <meta name='description' content={description} />
            <meta property='og:title' content={ogTitle} />
            <meta type='og:description' content={ogDescription} />
            <meta property='og:type' content='website' />
            <meta property='og:url' content={`${process.env.REACT_APP_DOMAIN}${window.location.pathname}`} />
            <meta property='og:site_name' content='Off the Mill' />
            <meta property='og:image' content={grapefruitPng} />  {/* not sure if this works...*/}
            <meta property='og:image:type' content='image/png' />

            <link rel='canonical' href={`${process.env.REACT_APP_DOMAIN}${window.location.pathname}`} />
        </Helmet>
    );
};



Meta.defaultProps = {
    title: 'Off the Mill',
    description: 'Goodies you love',
    ogTitle: 'Off the Mill', // e.g.: Off the Mill | Products
    ogDescription: 'Goodies you love'
}

export default Meta;
