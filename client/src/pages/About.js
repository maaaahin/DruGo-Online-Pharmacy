import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About"}>
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Image Section */}
          <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
            <img
              src="/images/about.png"
              alt="About Us"
              className="img-fluid rounded w-75"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </div>

          {/* Text Section */}
          <div className="col-md-6">
            <h2 className="text-danger mb-4">About DruGo</h2>
            <p className="text-primary fs-5">
              Established with a vision to serve the community, <strong>Vinayaak Medical and General Store </strong>
              has been a trusted name in healthcare for years. Located in the heart of the neighborhood, we’ve
              earned the confidence of our customers through genuine products, compassionate service,
              and an unwavering commitment to well-being.
            </p>
            <p className="text-primary fs-5">
              Our online platform is an extension of that mission — to provide easy access to medicines,
              healthcare products, and daily essentials from the comfort of your home. Whether you need
              prescription drugs, over-the-counter medicines, or wellness products, Vinayaak is here
              24x7 to ensure you and your family stay healthy and cared for.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};



export default About;
