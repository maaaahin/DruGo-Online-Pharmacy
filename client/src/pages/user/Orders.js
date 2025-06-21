import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu"; // Assuming this handles user-specific navigation
import Layout from "./../../components/Layout/Layout"; // Assuming this handles overall page structure
import axios from "axios";
import { useAuth } from "../../context/auth"; // For accessing user authentication details
import moment from "moment"; // For formatting dates

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Destructure auth context to get user data

  // Function to fetch user orders from the backend API
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data); // Set the fetched orders to state
    } catch (error) {
      console.log(error); // Log error for debugging
      // Optionally, add a toast notification for error
      // toast.error("Failed to fetch your orders.");
    }
  };

  // useEffect hook to call getOrders when the component mounts or auth token changes
  useEffect(() => {
    if (auth?.token) { // Only fetch orders if the user is authenticated
      getOrders();
    }
  }, [auth?.token]); // Dependency array includes auth.token

  // Helper function to truncate product description for display
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <Layout title={"Your Orders - DruGo"}> {/* Updated title for clarity and branding */}
      <div className="container-fluid p-4 dashboard-page"> {/* Consistent padding and unique class */}
        <div className="row">
          {/* User Menu Column */}
          <div className="col-md-3 mb-4">
            <UserMenu />
          </div>

          {/* Orders Display Column */}
          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">Your Orders</h1>

            {orders.length === 0 ? (
              <div className="alert alert-info text-center mt-5" role="alert">
                You haven't placed any orders yet.
              </div>
            ) : (
              // Map through each order
              orders?.map((o, i) => (
                <div key={o._id} className="border rounded-lg shadow-sm mb-4 p-3 order-card"> {/* Enhanced individual order card */}
                  {/* Order Summary Table */}
                  <div className="table-responsive"> {/* Make table responsive for smaller screens */}
                    <table className="table table-hover table-striped mb-3 text-center"> {/* Improved table styling */}
                      <thead className="bg-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Status</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">Order Date</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td><span className={`badge ${o.status === 'Not Process' ? 'bg-warning text-dark' : o.status === 'Processing' ? 'bg-info text-dark' : o.status === 'Shipped' ? 'bg-primary' : o.status === 'Delivered' ? 'bg-success' : 'bg-secondary'}`}>{o?.status}</span></td> {/* Status badge */}
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createAt).format("MMMM Do YYYY, h:mm:ss a")}</td> {/* Detailed date format */}
                          <td>{o?.payment?.success ? "Paid" : "Cash on Delivery"}</td> {/* Dynamic payment status */}
                          <td>{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Products in the Order */}
                  <h5 className="mb-3 text-secondary border-bottom pb-2">Products in this Order:</h5>
                  <div className="container-fluid">
                    {o?.products?.map((p) => (
                      <div className="row mb-3 p-3 bg-light rounded shadow-sm align-items-center product-item-card" key={p._id}> {/* Enhanced product item card */}
                        <div className="col-md-3 col-sm-4 text-center">
                          <img
                            src={`/api/v1/products/product-photo/${p._id}`} 
                            className="img-fluid rounded"
                            alt={p.name}
                            style={{ maxHeight: "100px", objectFit: "contain" }}
                          />
                        </div>
                        <div className="col-md-9 col-sm-8">
                          <h5 className="mb-1 fw-bold">{p.name}</h5>
                          <p className="text-muted mb-1 small">{truncateDescription(p.description, 80)}</p>
                          <p className="fw-semibold mb-0 text-primary">Price: ₹{p.price.toLocaleString("en-IN")}</p> {/* Formatted price */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;