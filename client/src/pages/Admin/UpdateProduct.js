import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineUpload, AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");

  // Get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/get-product/${params.slug}`
      );
      if (data?.success) {
        const product = data.product;
        setName(product.name);
        setId(product._id);
        setDescription(product.description);
        setPrice(product.price);
        setQuantity(product.quantity);
        setShipping(product.shipping ? "1" : "0");
        setCategory(product.category._id);
      } else {
        toast.error(data?.message || "Failed to fetch product details.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching product details.");
    }
  };

  useEffect(() => {
    if (params.slug) {
      getSingleProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      } else {
        toast.error(data?.message || "Something went wrong in getting categories.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories.");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle product update
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Removed loadingToastId
    toast.loading("Updating product...");
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      if (photo instanceof File) {
        productData.append("photo", photo);
      }
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.put(
        `/api/v1/products/update-product/${id}`,
        productData
      );

      if (data?.success) {
        // Removed id from toast.success
        toast.success(data?.message || "Product Updated Successfully!");
        navigate("/dashboard/admin/products");
      } else {
        // Removed id from toast.error
        toast.error(data?.message || "Product update failed.");
      }
    } catch (error) {
      console.log(error);
      // Removed id from toast.error
      toast.error("Something went wrong while updating the product.");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
      if (!confirmDelete) return;

      // Removed loadingToastId
      toast.loading("Deleting product...");

      const { data } = await axios.delete(`/api/v1/products/delete-product/${id}`);

      if (data?.success) {
        // Removed id from toast.success
        toast.success("Product deleted successfully!");
        navigate("/dashboard/admin/products");
      } else {
        // Removed id from toast.error
        toast.error(data?.message || "Failed to delete product.");
      }
    } catch (error) {
      console.log(error);
      // Removed id from toast.error
      toast.error("Something went wrong while deleting the product.");
    }
  };

  return (
    <Layout title={"Admin - Update Product"}>
      <div className="container-fluid p-4 dashboard">
        <div className="row">
          <div className="col-md-3 mb-4">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">Update Product</h1>

            <div className="card p-4 shadow-sm w-100">
              <h4 className="mb-4 text-secondary">Edit Product Details</h4>

              <form onSubmit={handleUpdate}>
                {/* Category Select */}
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

                {/* Photo Upload */}
                <div className="mb-3">
                  <label className="btn btn-outline-secondary col-md-12 py-2 d-flex align-items-center justify-content-center">
                    <AiOutlineUpload className="me-2 fs-5" />
                    {photo instanceof File ? photo.name : "Upload New Photo (Optional)"}
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>

                {/* Photo Preview */}
                <div className="mb-3">
                  {(photo instanceof File && photo) ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product_photo_preview"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "250px", objectFit: "contain", border: "1px solid #ddd" }}
                      />
                    </div>
                  ) : (
                    id && (
                      <div className="text-center">
                        <img
                          src={`/api/v1/products/product-photo/${id}`}
                          alt="current_product_photo"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: "250px", objectFit: "contain", border: "1px solid #ddd" }}
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Product Name */}
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

                {/* Description */}
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

                {/* Price */}
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

                {/* Quantity */}
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
                    min="0"
                  />
                </div>

                {/* Shipping Select */}
                <div className="mb-3">
                  <label htmlFor="shippingSelect" className="form-label fw-semibold">Shipping Available:</label>
                  <Select
                    id="shippingSelect"
                    bordered={true}
                    placeholder="Select shipping availability"
                    size="large"
                    className="form-control-ant"
                    onChange={(value) => setShipping(value)}
                    value={shipping || undefined}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                {/* Action Buttons: Update and Delete */}
                <div className="d-flex justify-content-between mt-4">
                  <button type="submit" className="btn btn-primary btn-lg flex-grow-1 me-2">
                    <AiOutlineSave className="me-2 fs-4" /> UPDATE PRODUCT
                  </button>
                  <button type="button" className="btn btn-danger btn-lg flex-grow-1 ms-2" onClick={handleDelete}>
                    <AiOutlineDelete className="me-2 fs-4" /> DELETE PRODUCT
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

export default UpdateProduct;