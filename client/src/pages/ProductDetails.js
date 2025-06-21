import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // For notifications
import { useCart } from "../context/cart"; // Cart context hook
import { FaShoppingCart, FaTags, FaBoxOpen, FaDollarSign, FaInfoCircle, FaArrowRight, FaPlusCircle } from "react-icons/fa"; // Icons

const ProductDetails = () => {
  const params = useParams(); // Get URL parameters (e.g., product slug)
  const navigate = useNavigate(); // Navigation hook
  const [product, setProduct] = useState({}); // State for the main product
  const [relatedProducts, setRelatedProducts] = useState([]); // State for similar products
  const [cart, setCart] = useCart(); // Cart context for adding items

  // Initial load for product details when component mounts or slug changes
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]); // Dependency array: re-run effect if slug changes

  // Function to fetch product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-product/${params.slug}`
      );
      if (data?.success) {
        setProduct(data?.product);
        // Fetch similar products after getting the main product
        getSimilarProduct(data?.product._id, data?.product.category._id);
      } else {
        toast.error("Product not found!");
        navigate("/"); // Redirect to homepage if product isn't found
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product details.");
    }
  };

  // Function to fetch similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/related-product/${pid}/${cid}`
      );
      if (data?.success) {
        setRelatedProducts(data?.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load similar products.");
    }
  };

  // Helper function to truncate product description for similar products
  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Handle adding product to cart
  const handleAddToCart = (p) => {
    const existingItem = cart.find(item => item._id === p._id);
    if (existingItem) {
      toast.error("This item is already in your cart!");
      return;
    }
    setCart([...cart, p]);
    localStorage.setItem("cart", JSON.stringify([...cart, p]));
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <Layout title={`Product - ${product.name || "Details"}`}>
      <div className="container py-4">
        {/* Main Product Details Section */}
        <div className="row product-detail-section mb-5 p-3 shadow-lg rounded-lg bg-white animate__animated animate__fadeIn">
          <div className="col-md-5 d-flex justify-content-center align-items-center mb-4 mb-md-0">
            {product._id ? (
              <img
                src={`/api/v1/products/product-photo/${product._id}`}
                className="img-fluid rounded product-main-img"
                alt={product.name}
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            ) : (
              <div className="text-center text-muted">Loading image...</div>
            )}
          </div>
          <div className="col-md-7 product-info-col">
            <h1 className="text-center text-primary mb-4 product-title-main">
              <FaInfoCircle className="me-2 text-primary" /> Product Details
            </h1>
            <hr />
            <h3 className="fw-bold mb-3">{product.name}</h3>
            <p className="lead text-muted mb-4">{product.description}</p>
            <h4 className="mb-3 text-success">
              Price : ₹{product.price?.toLocaleString("en-IN")}
            </h4>
            <h4 className="mb-4 text-secondary">
              <FaTags className="me-2" /> Category : {product?.category?.name || "N/A"}
            </h4>
            <button
              className="btn btn-warning add-to-cart-btn-lg"
              onClick={() => handleAddToCart(product)}
              disabled={!product._id} // Disable if product data isn't loaded
            >
              <FaShoppingCart className="me-2" /> ADD TO CART
            </button>
          </div>
        </div>

        <hr className="my-5 border-primary" /> {/* Styled HR */}

        {/* Similar Products Section */}
        <div className="similar-products-section">
          <h3 className="text-center mb-4 section-heading">
            <FaBoxOpen className="me-2" /> Similar Products
          </h3>
          {relatedProducts.length === 0 ? (
            <p className="text-center text-muted fs-5">No similar products found.</p>
          ) : (
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {relatedProducts?.map((p) => (
                <div className="card product-card shadow-sm border-0 animate__animated animate__fadeInUp" key={p._id}>
                  <img
                    src={`/api/v1/products/product-photo/${p._id}`}
                    className="card-img-top product-img"
                    alt={p.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title product-title">{p.name}</h5>
                    <p className="card-text product-description">
                      {truncateDescription(p.description, 50)}
                    </p>
                    <p className="card-price mt-auto">₹ {p.price.toLocaleString("en-IN")}</p>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm me-1 flex-grow-1"
                        onClick={() => navigate(`/products/${p.slug}`)}
                      >
                        <FaArrowRight className="me-1" /> View
                      </button>
                      <button
                        className="btn btn-secondary btn-sm ms-1 flex-grow-1"
                        onClick={() => handleAddToCart(p)}
                      >
                        <FaPlusCircle className="me-1" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;