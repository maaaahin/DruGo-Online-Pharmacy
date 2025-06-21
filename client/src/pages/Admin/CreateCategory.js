import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu'; // Assuming this is already attractive
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/categoryForm'; // Assuming this component is also styled well
import { Modal } from 'antd'; // Ant Design Modal for edit functionality
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'; // React Icons for edit/delete buttons

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false); // Controls modal visibility
  const [selected, setSelected] = useState(null); // Stores the category being edited
  const [updatedName, setUpdatedName] = useState(''); // Stores the name for updating

  // Handle form submission for creating a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/category/create-category', { name });
      if (data?.success) {
        toast.success(`${name} is created successfully!`);
        getAllCategories(); // Refresh categories after creation
        setName(''); // Clear input field
      } else {
        toast.error(data.message || "Failed to create category.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating the category.");
    }
  };

  // Get all categories from the backend
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data?.category);
      } else {
        console.error("Failed to fetch categories:", data?.message);
        toast.error(data?.message || "Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong while fetching categories.");
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    getAllCategories();
  }, []);

  // Handle category update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName });
      if (data.success) {
        toast.success(`${updatedName} updated successfully!`);
        setVisible(false); // Close modal
        setSelected(null); // Clear selected category
        setUpdatedName(''); // Clear updated name input
        getAllCategories(); // Refresh categories
      } else {
        toast.error(data.message || "Failed to update category.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the category.");
    }
  };

  // Handle category deletion
  const handleDelete = async (pId, categoryName) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${pId}`);
      if (data.success) {
        toast.success(`${categoryName} deleted successfully!`); // Use actual category name for toast
        getAllCategories(); // Refresh categories
      } else {
        toast.error(data.message || "Failed to delete category.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the category.");
    }
  };

  return (
    <Layout title={"Admin - Create Category"}>
      <div className='container-fluid p-4 dashboard'> {/* Added consistent padding */}
        <div className='row'>
          <div className='col-md-3 mb-4'> {/* Added bottom margin for spacing */}
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1 className='text-center mb-5 display-5 fw-bold text-primary'>Manage Categories</h1> {/* Prominent heading */}

            {/* Category Creation Form */}
            <div className='card p-4 shadow-sm mb-5'> {/* Card styling for the form */}
              <h4 className='mb-4 text-secondary'>Create New Category</h4>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
                buttonText="Create Category" 
              />
            </div>

            {/* Categories Table */}
            <div className='card p-4 shadow-sm'> {/* Card styling for the table */}
              <h4 className='mb-4 text-secondary'>Existing Categories</h4>
              {categories.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                  No categories found. Start by creating one!
                </div>
              ) : (
                <div className='table-responsive'> {/* Make table responsive */}
                  <table className="table table-hover table-striped mb-0"> {/* Hover, striped rows, no bottom margin */}
                    <thead className="table-light"> {/* Light table header */}
                      <tr>
                        <th scope="col" className="col-8">Category Name</th> {/* Wider column for name */}
                        <th scope="col" className="col-4 text-center">Actions</th> {/* Centered actions column */}
                      </tr>
                    </thead>
                    <tbody>
                      {categories?.map((c) => (
                        <tr key={c._id}>
                          <td className='align-middle fs-6'>{c.name}</td> {/* Align middle, slightly smaller text */}
                          <td className='text-center align-middle'> {/* Centered actions */}
                            <button
                              className='btn btn-outline-primary btn-sm me-2' // Smaller, outline primary button
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(c.name);
                                setSelected(c);
                              }}
                            >
                              <AiFillEdit className="me-1" /> Edit
                            </button>
                            <button
                              className='btn btn-outline-danger btn-sm' // Smaller, outline danger button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${c.name}"?`)) { // Confirmation dialog
                                  handleDelete(c._id, c.name);
                                }
                              }}
                            >
                              <AiFillDelete className="me-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Edit Category Modal */}
            <Modal
              title="Edit Category" // Modal title
              onCancel={() => {
                setVisible(false);
                setSelected(null); // Clear selected on cancel
                setUpdatedName(''); // Clear updated name on cancel
              }}
              footer={null}
              visible={visible}
              centered // Center the modal on screen
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
                buttonText="Update Category" 
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;