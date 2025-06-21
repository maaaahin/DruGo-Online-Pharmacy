import React from 'react';
import Layout from './../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu'; // Assuming this has been made attractive
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className='container-fluid p-4'> {/* Increased padding for overall section */}
        <div className='row'>
          {/* Admin Menu Column */}
          <div className='col-md-3 mb-4'> {/* Added bottom margin for spacing on smaller screens */}
            <AdminMenu />
          </div>

          {/* Admin Details Column */}
          <div className='col-md-9'>
            <div className='card p-4 shadow-sm h-100'> {/* Increased padding, subtle shadow, and full height */}
              <h3 className='mb-4 text-primary text-center'>Admin Information</h3> {/* Prominent heading */}
              <ul className='list-group list-group-flush'> {/* Use a list group for details */}
                <li className='list-group-item d-flex justify-content-between align-items-center py-2'>
                  <span className='fw-semibold text-muted'>Name:</span>
                  <span className='fw-bold text-dark'>{auth?.user?.name}</span>
                </li>
                <li className='list-group-item d-flex justify-content-between align-items-center py-2'>
                  <span className='fw-semibold text-muted'>Email:</span>
                  <span className='fw-bold text-dark'>{auth?.user?.email}</span>
                </li>
                <li className='list-group-item d-flex justify-content-between align-items-center py-2'>
                  <span className='fw-semibold text-muted'>Contact:</span>
                  <span className='fw-bold text-dark'>{auth?.user?.phone || 'N/A'}</span> {/* Handle potential missing phone */}
                </li>
                {/* You can add more admin details here following the same pattern */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;