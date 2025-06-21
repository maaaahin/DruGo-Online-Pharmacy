import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { AiOutlineUpload, AiOutlinePlus } from 'react-icons/ai';

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);

  // Get all categories for the dropdown
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      } else {
        toast.error(data?.message || "Failed to fetch categories.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories.");
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle product creation
  const handleCreate = async (e) => {
    e.preventDefault();
    // --- FIX START ---
    const loadingToastId = toast.loading("Creating product..."); // Declared with const
    // --- FIX END ---
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      if (photo) {
        productData.append("photo", photo);
      }
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.post(
        "/api/v1/products/create-product",
        productData
      );

      if (data?.success) {
        toast.success("Product created successfully!", { id: loadingToastId });
        // Clear all fields
        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setShipping("");
        setPhoto(null);

        // Navigate to products page after a short delay
        setTimeout(() => {
          navigate("/dashboard/admin/products");
        }, 1000);
      } else {
        toast.error(data?.message || "Product creation failed.", { id: loadingToastId });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating the product.", { id: loadingToastId });
    }
  };

  return (
    <Layout title={"Admin - Create Product"}>
      <div className="container-fluid p-4 dashboard">
        <div className="row">
          <div className="col-md-3 mb-4">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">Create Product</h1>

            <div className="card p-4 shadow-sm w-100">
              <h4 className="mb-4 text-secondary">Product Details</h4>

              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label htmlFor="categorySelect" className="form-label fw-semibold">Select Category:</label>
                  <Select
                    id="categorySelect"
                    bordered={true}
                    placeholder="Choose a category"
                    size="large"
                    showSearch
                    className="form-control-ant"
                    onChange={(value) => setCategory(value)}
                    value={category || undefined}
                  >
                    {categories?.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-3">
                  <label className="btn btn-outline-secondary col-md-12 py-2 d-flex align-items-center justify-content-center">
                    <AiOutlineUpload className="me-2 fs-5" />
                    {photo ? photo.name : "Upload Product Photo"}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>

                <div className="mb-3">
                  {photo && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product_photo"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "250px", objectFit: "contain", border: "1px solid #ddd" }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="productName" className="form-label fw-semibold">Product Name:</label>
                  <input
                    id="productName"
                    type="text"
                    value={name}
                    placeholder="Enter product name"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label fw-semibold">Description:</label>
                  <textarea
                    id="productDescription"
                    value={description}
                    placeholder="Write a detailed description"
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label fw-semibold">Price (₹):</label>
                  <input
                    id="productPrice"
                    type="number"
                    value={price}
                    placeholder="Enter product price"
                    className="form-control"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productQuantity" className="form-label fw-semibold">Quantity:</label>
                  <input
                    id="productQuantity"
                    type="number"
                    value={quantity}
                    placeholder="Enter product quantity"
                    className="form-control"
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="shippingSelect" className="form-label fw-semibold">Shipping Available:</label>
                  <Select
                    id="shippingSelect"
                    bordered={true}
                    placeholder="Select shipping availability"
                    size="large"
                    className="form-control-ant"
                    onChange={(value) => setShipping(value)}
                    value={shipping !== "" ? shipping : undefined}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <AiOutlinePlus className="me-2 fs-4" /> CREATE PRODUCT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;