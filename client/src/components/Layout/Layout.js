import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {Helmet} from "react-helmet";
import { Toaster } from 'react-hot-toast';
const Layout = ({children, title, description, keywords, author}) => {
  return (
    <div>
        <Helmet>
            <meta charSet="utf-8" />
            <meta name="title" content={title} data-react-helmet="true"/>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <title>{title}</title>
        </Helmet>
        <Header/>
        <main style={{minHeight:'80vh'}}>
        <Toaster />
          {children}</main>

        <Footer/>
        
    </div>
  );
};

Layout.defaultProps = 
{
  title: "DruGo - Online Pharmacy", 
  description: "Online Pharmacy",
  keywords: "Drugo, Online Pharmacy, Medicines, Healthcare",
  author: "Vinayaak Medicals",
};

export default Layout;
