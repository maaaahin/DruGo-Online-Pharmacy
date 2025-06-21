import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory"; // Custom hook to fetch categories
import Layout from "../components/Layout/Layout"; // Your main layout component
import { FaBoxes } from "react-icons/fa"; // Importing an icon for visual appeal

const Categories = () => {
  const categories = useCategory(); // Fetch all categories using your custom hook

  return (
    <Layout title={"All Categories - DruGo"}> {/* Updated title for branding */}
      <div className="container py-5"> {/* Increased vertical padding for better spacing */}
        <h1 className="text-center mb-5 display-4 fw-bold text-primary animate__animated animate__fadeInDown">
          <FaBoxes className="me-3" /> Explore All Categories
        </h1>

        {categories.length === 0 ? (
          <div className="alert alert-info text-center mt-5" role="alert">
            No categories found. Please check back later!
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"> {/* Responsive grid for cards */}
            {categories.map((c) => (
              <div className="col animate__animated animate__fadeInUp" key={c._id}> {/* Individual column for each category card */}
                <Link
                  to={`/category/${c.slug}`}
                  className="text-decoration-none d-block h-100" // Ensure link covers the whole card
                >
                  <div className="card h-100 shadow-sm border-0 rounded-3 category-card"> {/* Attractive card styling */}
                    <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                      <h3 className="card-title text-center text-dark fw-semibold mb-0">
                        {c.name}
                      </h3>
                      {/* You could add a category image here if your category schema supports it */}
                      {/* <img src="..." className="card-img-top" alt={c.name} /> */}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;