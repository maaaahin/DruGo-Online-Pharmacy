import React from 'react'
import Layout from '../components/Layout/Layout'
import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
    <Layout>
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <h1 className="display-1 text-danger fw-bold">404</h1>
          <h2 className="mb-3 text-secondary text-primary">Oops! Page Not Found</h2>
          <p className="text-muted mb-4 text-primary">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-outline-primary px-4 py-2">
            Go Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};





export default PageNotFound;

