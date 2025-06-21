import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu"; // Assuming this is already attractive
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, Tag } from "antd"; // Import Tag for status badge
const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    // --- FIX START ---
    const loadingToastId = toast.loading("Updating order status..."); // Declared with const
    // --- FIX END ---
    try {
      const { data } = await axios.put(
        `/api/v1/auth/order-status/${orderId}`,
        {
          status: value,
        }
      );
      if (data?.success) {
        toast.error(data?.message || "Failed to update order status.", { id: loadingToastId });
      } else {
        toast.success("Order status updated successfully!", { id: loadingToastId });
        getOrders(); // Refresh orders after successful update
        
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating status.", { id: loadingToastId });
    }
  };

  return (
    <Layout title={"Admin - Manage Orders"}>
      <div className="container-fluid p-4 dashboard">
        <div className="row">
          <div className="col-md-3 mb-4">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">All Orders</h1>

            {orders.length === 0 ? (
              <div className="alert alert-info text-center mt-5" role="alert">
                No orders found.
              </div>
            ) : (
              orders?.map((o, i) => (
                <div key={o._id} className="card shadow-sm mb-4 border-0">
                  <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 text-dark">Order # {i + 1}</h5>
                    <span className="text-muted small">Ordered: {moment(o?.createAt).format("MMMM Do YYYY, h:mm:ss a")} ({moment(o?.createAt).fromNow()})</span>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" className="text-center">#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Buyer</th>
                            <th scope="col">Payment</th>
                            <th scope="col" className="text-center">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-center align-middle">{i + 1}</td>
                            <td className="align-middle">
                              <Select
                                bordered={false}
                                onChange={(value) => handleChange(o._id, value)}
                                defaultValue={o?.status}
                                className="w-100"
                              >
                                {status.map((s, idx) => (
                                  <Option key={idx} value={s}>
                                    <Tag color={
                                        s === "Delivered" ? "success" :
                                        s === "Shipped" ? "processing" :
                                        s === "Processing" ? "warning" :
                                        s === "Cancel" ? "error" :
                                        "default"
                                    }>
                                        {s}
                                    </Tag>
                                  </Option>
                                ))}
                              </Select>
                            </td>
                            <td className="align-middle">{o?.buyer?.name}</td>
                            <td className="align-middle">
                              <Tag color={o?.payment.success ? "green" : "red"}>
                                {o?.payment.success ? "Success" : "Failed"}
                              </Tag>
                            </td>
                            <td className="text-center align-middle">{o?.products?.length}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer bg-white pt-4">
                    <h6 className="mb-3 text-muted">Products in this Order:</h6>
                    <div className="row g-3">
                      {o?.products?.map((p) => (
                        <div key={p._id} className="col-12 col-md-6 col-lg-4">
                          <div className="card h-100 product-card border shadow-sm">
                            <div className="row g-0">
                              <div className="col-4 d-flex align-items-center justify-content-center p-2">
                                <img
                                  src={`/api/v1/product/product-photo/${p._id}`}
                                  className="img-fluid rounded-start product-img"
                                  alt={p.name}
                                  style={{ maxHeight: '100px', objectFit: 'contain' }}
                                />
                              </div>
                              <div className="col-8">
                                <div className="card-body py-2 px-3">
                                  <h6 className="card-title mb-1 text-truncate">{p.name}</h6>
                                  <p className="card-text mb-1 small text-muted text-truncate">{p.description.substring(0, 50)}...</p>
                                  <p className="card-text fw-bold text-primary mb-0">Price: ₹{p.price}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default AdminOrders;