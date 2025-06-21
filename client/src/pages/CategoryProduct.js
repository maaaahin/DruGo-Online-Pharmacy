import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBoxes, FaEye, FaCartPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCart } from "../context/cart";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) {
      getProductsByCat();
    }
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/product-category/${params.slug}`
      );
      if (data?.success) {
        setProducts(data?.products);
        setCategory(data?.category);
      } else {
        setProducts([]);
        setCategory(null);
        toast.error("Category or products not found!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching products.");
    }
  };

  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      toast.error("Item already in cart!");
      return;
    }

    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item added to cart!");
  };

  return (
    <Layout title={`Category - ${category?.name || "Products"}`}>
      <div className="container py-4">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary animate__animated animate__fadeInDown">
            <FaBoxes className="me-3" /> {category?.name || "Loading..."}
          </h1>
          <p className="lead text-muted">
            {products?.length > 0
              ? `${products.length} product(s) found in this category.`
              : "No products available in this category yet."}
          </p>
        </div>

        <div className="row">
          {/* Main content column, now truly centered */}
          <div className="col-12 d-flex justify-content-center"> {/* Added justify-content-center */}
            {products.length === 0 && !category ? (
                <div className="alert alert-info text-center mt-5" role="alert">
                    Loading products... If nothing appears, there might be no products in this category or an error occurred.
                </div>
            ) : products.length === 0 && category ? (
                <div className="alert alert-warning text-center mt-5" role="alert">
                    No products found for "{category.name}". Please check back later!
                </div>
            ) : (
              <div className="d-flex flex-wrap justify-content-center gap-4"> {/* Changed justify-content-md-start to justify-content-center */}
                {products?.map((p) => (
                  <div
                    className="card product-card shadow-sm border-0 rounded-lg animate__animated animate__fadeInUp"
                    style={{ width: "18rem" }}
                    key={p._id}
                  >
                    <img
                      src={`/api/v1/products/product-photo/${p._id}`}
                      className="card-img-top product-img"
                      alt={p.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold text-dark mb-2">{p.name}</h5>
                      <p className="card-text text-muted small mb-3">
                        {truncateDescription(p.description, 60)}
                      </p>
                      <p className="card-text fw-semibold text-primary fs-5 mt-auto">
                        Price: ₹{p.price.toLocaleString("en-IN")}
                      </p>
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-outline-primary btn-sm flex-grow-1 me-2"
                          onClick={() => navigate(`/products/${p.slug}`)}
                        >
                          <FaEye className="me-1" /> Details
                        </button>
                        <button
                          className="btn btn-dark btn-sm flex-grow-1"
                          onClick={() => addToCart(p)}
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
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;