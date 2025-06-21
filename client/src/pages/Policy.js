import React from "react";
import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Image Section */}
          <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center align-items-center">
            <img
              src="/images/contactus.png"
              alt="Contact Us"
              className="img-fluid rounded"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </div>
          <div className="col-md-6">
          <h2>Privacy Policy</h2>
          <p>
            At Vinayaak Medical and General Store, your privacy is important to us. This policy outlines how we collect, use, and safeguard your information.
          </p>
          <p>
            <strong>Information Collection:</strong> We collect personal details such as your name, contact information, and medical history only when necessary for order fulfillment and compliance with legal regulations.
          </p>
          <p>
            <strong>Usage:</strong> Your data is used strictly for processing your orders, improving our services, and communicating with you about your prescriptions or purchases.
          </p>
          <p>
            <strong>Security:</strong> We implement robust security measures to protect your information from unauthorized access, alteration, or disclosure.
          </p>
          <p>
            <strong>Third-Party Sharing:</strong> We do not sell or share your personal information with third parties, except when legally required or necessary for delivery and payment processing.
          </p>
          <p>
            <strong>Cookies:</strong> We use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.
          </p>
          <p>
            <strong>Updates:</strong> This policy may be updated periodically. Continued use of our platform implies acceptance of any changes.
          </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
