import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminMenu = () => {
  return (
    <div className='card p-3 shadow-sm'> {/* Add card styling and padding */}
      <h4 className='text-center mb-4 text-primary'>Admin Dashboard</h4> {/* Stronger heading */}
      <div className="list-group">
        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action border-0 rounded-0" // Remove borders, no rounded corners
          activeClassName="active fw-bold text-white bg-primary" // Highlight active link
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className="list-group-item list-group-item-action border-0 rounded-0"
          activeClassName="active fw-bold text-white bg-primary"
        >
          Create Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/products"
          className="list-group-item list-group-item-action border-0 rounded-0"
          activeClassName="active fw-bold text-white bg-primary"
        >
          View Products
        </NavLink>
        <NavLink
          to="/dashboard/admin/orders"
          className="list-group-item list-group-item-action border-0 rounded-0"
          activeClassName="active fw-bold text-white bg-primary"
        >
          Manage Orders
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;