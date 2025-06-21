import React from 'react';
import { NavLink } from 'react-router-dom';

const UserMenu = () => {
  return (
    <div className='card p-4 shadow-sm rounded-lg'> {/* Added card styling, more padding, slightly rounded */}
      <h4 className='text-center mb-4 text-secondary'>User Dashboard</h4> {/* Changed heading to h4, secondary color, more margin */}
      <div className="list-group list-group-flush"> {/* list-group-flush removes borders between items */}
        <NavLink
          to="/dashboard/user/profile"
          className="list-group-item list-group-item-action border-0 py-3 ps-4" // No borders, increased vertical padding, left padding
          activeClassName="active-user-link text-white bg-primary fw-bold rounded" // Custom active class for user links
        >
          My Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className="list-group-item list-group-item-action border-0 py-3 ps-4"
          activeClassName="active-user-link text-white bg-primary fw-bold rounded"
        >
          My Orders
        </NavLink>
        {/* Add more NavLink items here if needed, e.g., <NavLink to="/dashboard/user/settings" ...>Settings</NavLink> */}
      </div>
    </div>
  );
};

export default UserMenu;