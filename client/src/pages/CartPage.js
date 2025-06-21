import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout"; // Your main layout component
import { useCart } from "../context/cart"; // Cart context hook
import { useAuth } from "../context/auth"; // Auth context hook
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For API calls
import toast from "react-hot-toast"; // For notifications
import { FaShoppingCart, FaTrashAlt, FaMapMarkerAlt, FaSignInAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Icons for visual appeal

const CartPage = () => {
  const [auth] = useAuth(); // Get auth state
  const [cart, setCart] = useCart(); // Get cart state and setter
  const [loading, setLoading] = useState(false); // Loading state for order placement
  const navigate = useNavigate(); // Navigation hook

  // Calculate total price of items in the cart
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total = total + item.price;
      });
      // Format total to Indian Rupees for clarity
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR", // Changed to INR (Indian Rupees)
      });
    } catch (error) {
      console.log(error);
      return "N/A"; // Return a fallback in case of error
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      if (index !== -1) { // Ensure item exists before removing
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
        toast.success("Item removed from cart!"); // Confirmation toast
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item.");
    }
  };

  // Handle placing the order (Cash on Delivery)
  const handlePlaceOrder = async () => {
    // Basic validation for cart and user address
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!auth?.user?.address) {
      toast.error("Please update your address before placing the order.", {
        icon: <FaMapMarkerAlt className="text-warning" />,
      });
      navigate("/dashboard/user/profile"); // Redirect to profile to update address
      return;
    }

    setLoading(true); // Set loading true during API call
    try {
      // API call to create an order
      // IMPORTANT: Double-check your backend route. `/api/v1/products/create` looks like a product creation route,
      // not an order creation route. It should typically be something like `/api/v1/orders/create` or similar.
      // I'm keeping it as `/api/v1/products/create` as per your original code, but strongly advise review.
      const { data } = await axios.post(
        "/api/v1/products/create", // <<< REVIEW THIS ENDPOINT >>>
        {
          cart,
          address: auth.user.address, // Send user's address with the order
          paymentMethod: "COD" // Explicitly state payment method if it's COD
        },
        {
          headers: {
            Authorization: auth?.token, // Include auth token for authenticated API call
          },
        }
      );

      if (data?.success) {
        localStorage.removeItem("cart"); // Clear cart from local storage
        setCart([]); // Clear cart state
        toast.success("Order placed successfully! (Cash on Delivery)", {
          icon: <FaCheckCircle className="text-success" />,
        });
        navigate("/dashboard/user/orders"); // Navigate to user's orders page
      } else {
        toast.error(data?.message || "Order failed. Please try again.", {
          icon: <FaExclamationCircle className="text-danger" />,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while placing your order. Please try again later.");
    } finally {
      setLoading(false); // Always set loading false after API call
    }
  };

  // Helper function to truncate product description
  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <Layout title={"Your Cart - DruGo"}>
      <div className="container py-4"> {/* Increased vertical padding */}
        <div className="row text-center mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-primary mb-2">
              <FaShoppingCart className="me-3" /> Your Shopping Cart
            </h1>
            <p className="lead text-muted">
              {cart?.length
                ? `You have ${cart.length} item(s) in your cart.`
                : "Your cart is empty. Start shopping now!"}
            </p>
            {!auth?.token && cart?.length > 0 && (
              <p className="text-info mt-3">
                <FaSignInAlt className="me-2" /> Please login to proceed to checkout.
              </p>
            )}
          </div>
        </div>

        <div className="row">
          {/* Left Column: Cart Items */}
          <div className="col-md-8 mb-4">
            {cart.length > 0 ? (
              cart.map((p) => (
                <div className="card mb-3 shadow-sm product-cart-item flex-md-row" key={p._id}>
                  <div className="row g-0 w-100">
                    <div className="col-md-4 col-sm-12 d-flex justify-content-center align-items-center p-3">
                      <img
                        src={`/api/v1/products/product-photo/${p._id}`}
                        className="img-fluid rounded"
                        alt={p.name}
                        style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
                      />
                    </div>
                    <div className="col-md-8 col-sm-12">
                      <div className="card-body d-flex flex-column justify-content-between h-100">
                        <div>
                          <h5 className="card-title fw-bold text-dark">{p.name}</h5>
                          <p className="card-text text-muted small mb-2">
                            {truncateDescription(p.description, 100)}
                          </p>
                          <p className="card-text fw-semibold text-primary fs-5 mb-3">
                            Price: ₹{p.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="mt-auto"> {/* Aligns button to bottom */}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeCartItem(p._id)}
                          >
                            <FaTrashAlt className="me-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-5 text-center shadow-sm">
                <h3 className="text-muted">Your cart is feeling a bit empty!</h3>
                <p>Add some amazing products to start your shopping journey.</p>
                <button
                  className="btn btn-primary mt-3 w-50 mx-auto"
                  onClick={() => navigate("/")}
                >
                  Go to Shop
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Cart Summary */}
          <div className="col-md-4">
            <div className="card shadow-lg p-4 sticky-top" style={{ top: '20px' }}> {/* Sticky for better visibility on scroll */}
              <h2 className="text-center mb-4 text-secondary border-bottom pb-3">Cart Summary</h2>
              <p className="text-center text-muted">Total | Checkout | Payment</p>
              <hr />
              <h4 className="mb-4 text-center fw-bold">Total: {totalPrice()} </h4>

              {auth?.user?.address ? (
                <div className="mb-3 text-center">
                  <h5 className="fw-semibold text-dark">
                    <FaMapMarkerAlt className="me-2 text-info" /> Current Delivery Address:
                  </h5>
                  <p className="lead text-muted">{auth.user.address}</p>
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3 text-center">
                  <p className="text-warning fw-semibold">
                    <FaExclamationCircle className="me-2" /> No address found.
                  </p>
                  {auth?.token ? (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Your Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      <FaSignInAlt className="me-2" /> Login to Checkout
                    </button>
                  )}
                </div>
              )}

              <hr />

              {/* Place Order Button (conditional rendering) */}
              <div className="mt-3">
                {cart?.length > 0 && auth?.user?.address && (
                  <button
                    className="btn btn-success btn-lg w-100"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      "Place Order (Cash on Delivery)"
                    )}
                  </button>
                )}
                {/* Message if cart is empty or address is missing */}
                {cart.length === 0 && (
                  <p className="text-muted text-center mt-3">Add items to place an order.</p>
                )}
                {cart.length > 0 && !auth?.user?.address && auth?.token && (
                   <p className="text-muted text-center mt-3">Please update your address to proceed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;