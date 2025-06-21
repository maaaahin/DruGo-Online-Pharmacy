import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-hot-toast"; // For notifications
import { useCart } from "../context/cart"; // Cart context hook
import { FaSearch, FaEye, FaCartPlus } from "react-icons/fa"; // Using FA6 icons

const Search = () => {
  const [values, setValues] = useSearch(); // Access search results and query
  const navigate = useNavigate(); // For navigating to product details
  const [cart, setCart] = useCart(); // Get cart state and setter from context

  // Helper function to truncate product description
  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Add product to cart handler
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      toast.error("Item already in cart!", { icon: '🛒' });
      return;
    }
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart!`, { icon: '👍' });
  };

  return (
    <Layout title={"Search Results - DruGo"}> {/* More descriptive title */}
      <div className="container py-4">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary animate__animated animate__fadeInDown">
            <FaSearch className="me-3" /> Search Results
          </h1>
          <p className="lead text-muted">
            {values?.results.length < 1
              ? `No products found for "${values?.keyword || ''}"`
              : `Found ${values.results.length} product(s) for "${values?.keyword || ''}"`}
          </p>
        </div>

        {values?.results.length === 0 ? (
          <div className="alert alert-info text-center mt-5" role="alert">
            Try a different search term or browse our categories.
          </div>
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-4 animate__animated animate__fadeInUp"> {/* Centered and spaced grid */}
            {values?.results.map((p) => (
              <div
                className="card product-card shadow-sm border-0 rounded-lg" // Reusing product card styling
                style={{ width: "18rem" }}
                key={p._id}
              >
                <img
                  src={`/api/v1/products/product-photo/${p._id}`} 
                  className="card-img-top product-img" // Added class for consistent image sizing
                  alt={p.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark mb-2">{p.name}</h5>
                  <p className="card-text text-muted small mb-3 flex-grow-1">
                    {truncateDescription(p.description, 60)}
                  </p>
                  <p className="card-text fw-semibold text-primary fs-5 mt-auto">
                  ₹ {p.price.toLocaleString("en-IN")}
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm flex-grow-1 me-2"
                      onClick={() => navigate(`/products/${p.slug}`)} // Navigate to product details
                    >
                      <FaEye className="me-1" /> Details
                    </button>
                    <button
                      className="btn btn-dark btn-sm flex-grow-1"
                      onClick={() => handleAddToCart(p)} // Add to cart functionality
                    >
                      <FaCartPlus className="me-1" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;