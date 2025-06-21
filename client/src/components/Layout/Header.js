import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaCartPlus } from "react-icons/fa6";
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
      <div className="container-fluid px-3 px-lg-5">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/images/DruGo.png" alt="Logo" height={40} className="me-2" />
        </Link>

        {/* Mobile Toggler and Cart Icon for Mobile */}
        <div className="d-flex order-lg-2 align-items-center"> {/* Use a div to group toggler and mobile cart */}
          {/* Cart Icon for mobile (always visible outside collapsed menu) */}
          <NavLink to="/cart" className="nav-link position-relative me-3 d-lg-none"> {/* d-lg-none hides on large screens and up */}
            <Badge count={cart?.length} offset={[5, 0]} showZero={false} size="small">
              <FaCartPlus size={30} className="text-danger" />
            </Badge>
          </NavLink>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>


        {/* Collapsible content */}
        <div className="collapse navbar-collapse mt-3 mt-lg-0 order-lg-1" id="navbarContent"> {/* order-lg-1 ensures it comes before the toggler/mobile cart on desktop */}
          {/* Search bar on mobile gets full width */}
          <div className="w-100 d-lg-none mb-3">
            <SearchInput />
          </div>

          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {/* Desktop Search */}
            <li className="d-none d-lg-block">
              <SearchInput />
            </li>

            {/* Home Link */}
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-primary fw-medium">
                Home
              </NavLink>
            </li>

            {/* Categories */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-primary fw-medium"
                to="/categories"
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>
              <ul className="dropdown-menu shadow-sm animate__animated animate__fadeInUp scrollable-dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/categories">All Categories</Link>
                </li>
                {categories?.map((c) => (
                  <li key={c.slug}>
                    <Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Auth Buttons */}
            {!auth.user ? (
              <>
                <li>
                  <NavLink
                    to="/register"
                    className="nav-link text-primary fw-medium"
                  >
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className="nav-link text-primary fw-medium"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-primary rounded-pill px-3 py-1 dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth?.user?.name || auth?.user?.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm animate__animated animate__fadeInUp">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <NavLink
                      className="dropdown-item text-danger"
                      to="/login"
                      onClick={handleLogout}
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {/* Cart Icon for Desktop (inside collapsed menu) */}
            <li className="d-none d-lg-block"> {/* d-none hides on small screens, d-lg-block shows on large and up */}
              <NavLink to="/cart" className="nav-link position-relative p-0">
                <Badge count={cart?.length} offset={[5, 0]} showZero={false} size="small">
                  <FaCartPlus size={30} className="text-danger" />
                </Badge>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;