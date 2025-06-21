import React from "react";
import Layout from "../../components/Layout/Layout"; // Assuming this handles overall page structure
import UserMenu from "../../components/Layout/UserMenu"; // Assuming this handles user-specific navigation
import { useAuth } from "../../context/auth"; // For accessing user authentication details

const Dashboard = () => {
  const [auth] = useAuth(); // Destructure auth context to get user data

  return (
    <Layout title={"User Dashboard - DruGo"}> {/* Updated title for clarity and branding */}
      <div className="container-fluid p-4 dashboard-page"> {/* Consistent padding and a unique class for potential custom styling */}
        <div className="row">
          {/* User Menu Column */}
          <div className="col-md-3 mb-4"> {/* Added bottom margin for spacing on smaller screens */}
            <UserMenu />
          </div>

          {/* User Details Column */}
          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">Your Dashboard</h1> {/* Prominent, styled heading */}

            <div className="card shadow-lg border-0 rounded-lg p-5 profile-card"> {/* Enhanced card styling */}
              <h2 className="mb-4 text-secondary border-bottom pb-3">User Profile</h2> {/* Section heading with separator */}
              <div className="row g-3"> {/* Use Bootstrap grid for better spacing within the card */}
                <div className="col-12">
                  <h4 className="fw-semibold text-dark mb-1">Name:</h4>
                  <p className="lead mb-0 text-muted">{auth?.user?.name}</p> {/* Larger, muted text for details */}
                </div>
                <div className="col-12">
                  <h4 className="fw-semibold text-dark mb-1">Email:</h4>
                  <p className="lead mb-0 text-muted">{auth?.user?.email}</p>
                </div>
                <div className="col-12">
                  <h4 className="fw-semibold text-dark mb-1">Address:</h4>
                  <p className="lead mb-0 text-muted">
                    {auth?.user?.address ? auth.user.address : "Address not provided"} {/* Handle missing address */}
                  </p>
                </div>
                 {/* You can add more user details here as needed, e.g., phone, role */}
                 {auth?.user?.phone && (
                  <div className="col-12">
                    <h4 className="fw-semibold text-dark mb-1">Phone:</h4>
                    <p className="lead mb-0 text-muted">{auth.user.phone}</p>
                  </div>
                )}
                {auth?.user?.role !== undefined && ( // Display role only if it exists
                  <div className="col-12">
                    <h4 className="fw-semibold text-dark mb-1">Role:</h4>
                    <p className="lead mb-0 text-muted">
                      {auth.user.role === 1 ? "Admin" : "User"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;