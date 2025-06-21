import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu"; // Assuming this component provides the admin navigation
import Layout from "../../components/Layout/Layout"; // Assuming this component provides the overall page layout
import { Link } from "react-router-dom"; // Used for navigation to product details/edit pages
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'; // Icons for edit and delete actions

const Products = () => {
  const [products, setProducts] = useState([]);

  // Function to fetch all products from the backend API
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/get-product");
      if (data?.success) {
        setProducts(data.products);
        toast.success("Products fetched successfully!"); // Success notification
      } else {
        toast.error(data?.message || "Failed to fetch products."); // Error notification with message from API or generic
      }
    } catch (error) {
      console.log(error); // Log error for debugging
      toast.error("Something went wrong while fetching products."); // Generic error notification
    }
  };

  // useEffect hook to call getAllProducts when the component mounts
  useEffect(() => {
    getAllProducts();
  }, []); // Empty dependency array ensures it runs only once on mount

  // Helper function to truncate product description for card display
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId, productName) => {
    // Show a confirmation dialog before proceeding with deletion
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        const { data } = await axios.delete(`/api/v1/products/delete-product/${productId}`);
        if (data?.success) {
          toast.success(`${productName} deleted successfully!`); // Success notification
          getAllProducts(); // Refresh the product list after successful deletion
        } else {
          toast.error(data?.message || "Failed to delete product."); // Error notification
        }
      } catch (error) {
        console.log(error); // Log error for debugging
        toast.error("Something went wrong while deleting the product."); // Generic error notification
      }
    }
  };

  return (
    <Layout title={"Admin - All Products"}>
      <div className="container-fluid p-4 dashboard">
        <div className="row">
          {/* Admin Menu Column */}
          <div className="col-md-3 mb-4">
            <AdminMenu />
          </div>

          {/* Products Display Column */}
          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">All Products</h1>

            {/* Conditional rendering: show message if no products exist */}
            {products.length === 0 ? (
              <div className="alert alert-info text-center mt-5" role="alert">
                No products found. Start by creating one!
                <div className="mt-3">
                  <Link to="/dashboard/admin/create-product" className="btn btn-primary btn-lg">Create New Product</Link>
                </div>
              </div>
            ) : (
              // Product grid using Bootstrap's responsive row-cols and gutters
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                {products?.map((p) => (
                  // Each column element is a flex container to ensure uniform card heights
                  <div className="col d-flex" key={p._id}>
                    {/* The entire card is a Link for navigation to the product's details/edit page */}
                    <Link
                      to={`/dashboard/admin/product/${p.slug}`} // Navigates to the product edit page
                      className="card h-100 shadow-sm border-0 text-decoration-none text-dark product-card-hover" // Styling for card, h-100 ensures full height within flex column
                    >
                      {/* Product Image */}
                      <img
                        src={`/api/v1/products/product-photo/${p._id}`}
                        className="card-img-top p-3"
                        alt={p.name}
                        style={{ height: "200px", objectFit: "contain", borderBottom: "1px solid #eee" }} // Consistent image height and style
                      />
                      {/* Card Body */}
                      <div className="card-body d-flex flex-column">
                        {/* Product Title */}
                        <h5 className="card-title mb-2 fw-bold text-truncate">{p.name}</h5>
                        {/* Product Description */}
                        <p className="card-text text-muted mb-3 small">
                          {truncateDescription(p.description, 90)}
                        </p>
                        {/* Price and Actions, pushed to bottom with mt-auto */}
                        <div className="mt-auto">
                            {/* Product Price */}
                            <p className="card-text fs-5 fw-bold text-primary mb-3">
                                ₹{p.price.toLocaleString("en-IN")} {/* Formats price for Indian Rupee */}
                            </p>
                            {/* Action Buttons: Edit and Delete */}
                            <div className="d-flex justify-content-between align-items-center">
                                {/* Edit Button */}
                                <Link to={`/dashboard/admin/products/${p.slug}`} className="btn btn-outline-primary btn-sm flex-grow-1 me-2 d-flex align-items-center justify-content-center">
                                    <FaEdit className="me-1" /> Edit
                                </Link>
                                {/* Delete Button */}
                                <button
                                    className="btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent Link navigation when delete button is clicked
                                        handleDeleteProduct(p._id, p.name);
                                    }}
                                >
                                    <FaRegTrashAlt className="me-1" /> Delete
                                </button>
                            </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;