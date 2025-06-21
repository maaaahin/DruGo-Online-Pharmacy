import React, { useState, useEffect, useRef } from "react"; // Import useRef
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart }  from "../context/cart";
import { toast } from "react-hot-toast";
import { FaFilter, FaRedo, FaEye, FaCartPlus, FaBoxOpen } from "react-icons/fa"; // Icons

import "../styles/Homepage.css"; // Ensure this CSS file is present and updated

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters on mobile

  // Create a ref for the products section
  const productsSectionRef = useRef(null);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories.");
    }
  };

  // Get all products (paginated)
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to load products.");
    }
  };

  // Get total product count for pagination
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get product count.");
    }
  };

  // Load more products when "Load More" is clicked
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/product-list/${page}`);
      setLoading(false);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to load more products.");
    }
  };

  // Filter products based on selected categories and price range
  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/products/product-filters", {
        checked,
        radio,
      });
      setLoading(false);
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to filter products.");
    }
  };

  // Handle category filter change
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      toast.error("This item is already in your cart!");
      return;
    }
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item added to cart!");
  };

  // Reset filters
  const handleResetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    getAllProducts();
    toast.success("Filters reset!", { icon: "🧹" });
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  // Function to scroll to the products section
  const scrollToProducts = () => {
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({
        behavior: "smooth", // For smooth scrolling
        block: "start",    // Align the top of the element with the top of the viewport
        inline: "nearest"  // Keep the element within the viewport horizontally
      });
    }
  };

  // Initial load for categories and total count
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Effect to load more products when 'page' state changes
  useEffect(() => {
    if (page === 1 && (checked.length || radio.length)) {
      return;
    }
    if (page > 1) {
      loadMore();
    }
  }, [page]);

  // Effect to apply filters or get all products when filter states change
  useEffect(() => {
    if (checked.length || radio.length) {
      setPage(1);
      filterProduct();
    } else {
      if (page === 1) {
        getAllProducts();
      }
    }
  }, [checked, radio]);

  // Truncate description function
  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Layout title={"All Products - DruGo"}>
      {/* --- Attractive Hero Banner --- */}
      <div className="hero-banner">
        <div className="container d-flex flex-column justify-content-center align-items-center text-center h-100">
          <h1 className="banner-heading animate__animated animate__fadeInDown">
            Your Health, Our Priority.
          </h1>
          <p className="banner-subheading animate__animated animate__fadeInUp">
            Quality Medicines & Healthcare Products Delivered to Your Doorstep.
          </p>
          <div className="banner-buttons animate__animated animate__zoomIn">
            <button className="btn btn-primary btn-lg banner-btn me-3" onClick={scrollToProducts}> {/* Changed onClick handler */}
              Shop Now <FaCartPlus className="ms-2" />
            </button>
            <button className="btn btn-outline-light btn-lg banner-btn" onClick={() => navigate('/about')}>
              Learn More <FaEye className="ms-2" />
            </button>
          </div>
        </div>
      </div>
      {/* --- End Hero Banner --- */}

      <div className="container-fluid homepage-container py-4">
        <div className="row">
          {/* Mobile Filter Toggle Button */}
          <div className="col-12 d-md-none text-center mb-3">
            <button
              className="btn btn-info w-75 filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Left Column: Filters (Conditionally visible on mobile) */}
          <div
            className={`col-md-3 filters-sidebar animate__animated animate__fadeInLeft ${
              showFilters ? "d-block" : "d-none d-md-block"
            }`}
          >
            <h4 className="text-center mb-4 filter-heading text-danger">
              <FaFilter className="me-2 text-danger" /> Filter By Categories
            </h4>
            <div className="category-filters mb-4 text-danger">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                  checked={checked.includes(c._id)}
                  className="filter-checkbox text-primary"
                >
                  <div className="text-primary">{c.name}</div>
                </Checkbox>
              ))}
            </div>

            <h4 className="text-center mb-4 filter-heading mt-4 text-danger">
              <FaFilter className="me-2 text-danger" /> Filter By Price
            </h4>
            <div className="price-filters mb-4">
              <Radio.Group
                onChange={(e) => setRadio(e.target.value)}
                value={radio}
              >
                {Prices?.map((p) => (
                  <div key={p._id} className="price-radio-item">
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-danger reset-filter-btn"
                onClick={handleResetFilters}
              >
                <FaRedo className="me-2" /> RESET FILTERS
              </button>
            </div>
          </div>

          {/* Right Column: Products Display */}
          {/* Apply the ref to the div that contains your product listings */}
          <div
            className="col-md-9 products-display animate__animated animate__fadeInRight"
            ref={productsSectionRef} // Apply the ref here
          >
            <h1 className="text-center mb-5 all-products-heading">
              <FaBoxOpen className="me-2" /> All Products
            </h1>
            {products.length === 0 && !loading && (
              <div className="alert alert-info text-center mt-5" role="alert">
                No products found matching your criteria. Try resetting filters.
              </div>
            )}
            <div className="product-grid">
              {products?.map((p) => (
                <div
                  className="card product-card shadow-sm border-0"
                  key={p._id}
                >
                  <img
                    src={`/api/v1/products/product-photo/${p._id}`}
                    className="card-img-top product-img"
                    alt={p.name}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="product-info">
                      <h5 className="card-title product-title">{p.name}</h5>
                      <p className="card-text product-description">
                        {truncateDescription(p.description, 60)}
                      </p>
                      <p className="card-price">
                        ₹ {p.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-auto button-group">
                      <button
                        className="btn btn-primary product-detail-btn"
                        onClick={() => navigate(`/products/${p.slug}`)}
                      >
                        <FaEye className="me-1" /> Details
                      </button>
                      <button
                        className="btn btn-secondary add-to-cart-btn"
                        onClick={() => handleAddToCart(p)}
                      >
                        <FaCartPlus className="me-1" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="loadmore-container text-center mt-5">
              {Array.isArray(products) &&
                products.length < total &&
                !checked.length &&
                !radio.length && (
                  <button
                    className="btn loadmore-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                )}
              {products &&
                products.length >= total &&
                !checked.length &&
                !radio.length && (
                  <p className="text-muted mt-3">All products displayed.</p>
                )}
              {(checked.length || radio.length) && products.length > 0 && (
                <p className="text-muted mt-3">
                  Clear filters to load more products.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;