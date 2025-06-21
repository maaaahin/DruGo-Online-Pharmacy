import React, { useEffect, useState } from "react";
import UserMenu from "../../components/Layout/UserMenu"; // Assuming this handles user-specific navigation
import Layout from "./../../components/Layout/Layout"; // Assuming this handles overall page structure
import { useAuth } from "../../context/auth"; // For accessing user authentication details
import { toast } from "react-hot-toast"; // For displaying notifications
import axios from "axios"; // For making API requests

const Profile = () => {
  // context
  const [auth, setAuth] = useAuth();

  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Get user data and populate form fields on component mount
  useEffect(() => {
    // Destructure properties from auth.user, providing default empty strings
    // to prevent errors if auth.user or its properties are null/undefined.
    const { email, name, phone, address } = auth?.user || {};
    setName(name || "");
    setEmail(email || "");
    setPhone(phone || "");
    setAddress(address || "");
    // Note: Password is intentionally not pre-filled for security reasons.
    // Users should enter their new password if they wish to change it.
  }, [auth?.user]); // Re-run effect if auth.user changes

  // Form submission handler for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    try {
      // Make a PUT request to update the user profile
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email, // Email might be disabled but sending it is fine
        password,
        phone,
        address,
      });

      if (data?.success) {
        // Update auth context with the new user data
        setAuth({ ...auth, user: data?.updatedUser });

        // Update user data in local storage
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));

        toast.success("Profile Updated Successfully!"); // Success notification
        setPassword(""); // Clear password field after successful update
      } else {
        toast.error(data?.message || "Failed to update profile."); // Error notification from backend
      }
    } catch (error) {
      console.log(error); // Log error for debugging
      // Provide a generic error message if backend error message is not available
      toast.error("Something went wrong while updating profile.");
    }
  };

  return (
    <Layout title={"Your Profile - DruGo"}> {/* Updated title for branding */}
      <div className="container-fluid p-4 dashboard-page"> {/* Consistent padding and a unique class */}
        <div className="row">
          {/* User Menu Column */}
          <div className="col-md-3 mb-4">
            <UserMenu />
          </div>

          {/* Profile Update Form Column */}
          <div className="col-md-9">
            <h1 className="text-center mb-5 display-5 fw-bold text-primary">Update Profile</h1> {/* Prominent heading */}

            <div className="d-flex justify-content-center align-items-center"> {/* Centering the card horizontally */}
              <div className="col-lg-8 col-md-10 col-sm-12"> {/* Responsive column sizing for the card */}
                <div className="card shadow-lg border-0 rounded-4 p-5 animate__animated animate__fadeIn"> {/* Enhanced card styling and animation */}
                  <div className="card-body">
                    <h2 className="text-center mb-4 text-secondary fw-bold border-bottom pb-3">
                      Edit Your Account Information
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3"> {/* Use Bootstrap grid for input spacing */}
                        {/* Name Input */}
                        <div className="mb-3 col-md-6">
                          <label htmlFor="name" className="form-label fw-semibold">
                            Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control form-control-lg"
                            id="name"
                            placeholder="Enter your name"
                            required // Name should generally be required
                          />
                        </div>

                        {/* Email Input (Disabled) */}
                        <div className="mb-3 col-md-6">
                          <label htmlFor="email" className="form-label fw-semibold">
                            Email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Keep onChange for consistency but it won't change
                            className="form-control form-control-lg bg-light" // Add bg-light to indicate it's disabled
                            id="email"
                            placeholder="Your email address"
                            disabled // Email should typically not be changeable via profile form
                          />
                        </div>

                        {/* Password Input */}
                        <div className="mb-3 col-md-6">
                          <label htmlFor="password" className="form-label fw-semibold">
                            New Password (optional)
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control form-control-lg"
                            id="password"
                            placeholder="Leave blank to keep current password"
                          />
                        </div>

                        {/* Phone Number Input */}
                        <div className="mb-3 col-md-6">
                          <label htmlFor="phone" className="form-label fw-semibold">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control form-control-lg"
                            id="phone"
                            placeholder="Enter your phone number"
                            required // Phone number often required
                          />
                        </div>

                        {/* Address Textarea */}
                        <div className="mb-4 col-12"> {/* Full width for address */}
                          <label htmlFor="address" className="form-label fw-semibold">
                            Address
                          </label>
                          <textarea
                            className="form-control form-control-lg"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            id="address"
                            rows="3" // Increased rows for better usability
                            placeholder="Enter your complete address"
                            required // Address is typically required
                          ></textarea>
                        </div>
                      </div> {/* End row g-3 */}

                      {/* Update Profile Button */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg mt-3" // Changed to btn-primary, added margin-top
                      >
                        Update Profile
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;