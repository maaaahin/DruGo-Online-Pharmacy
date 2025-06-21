import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhoneCall } from "react-icons/bi";
import { GiRotaryPhone } from "react-icons/gi";
import { MdOutlineAddLocation } from "react-icons/md";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
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


          {/* Contact Info Section */}
          <div className="col-md-6">
            <h1 className="text-center text-danger mb-4">Contact Us</h1>
            <p className="text-primary mb-4 text-center">
              Have questions about medicines, orders, or need support? We're available to help you!
            </p>

            <ul className="list-unstyled fs-5">
              
              <li className="mb-3">
                <GiRotaryPhone size={32} className="text-primary me-2" />
                <strong>Telephone:</strong> 0141 240 1345
              </li>
              <li className="mb-3">
                <BiPhoneCall size={32} className="text-primary me-2"/>
                <strong>Phone:</strong> +91 9414254291
              </li>
              <li className="mb-3">
                <MdOutlineAddLocation size={32} className="text-primary me-2" />
                <strong>Address:</strong> 94/20, Madhyam Marg, near Meera Marg, Mansarovar Sector 9, Sector 9, Mansarovar, Jaipur, Rajasthan 302020
              </li>
              <li className="mb-3">
                <BiMailSend size={32} className="text-primary me-2" />
                <strong>Email:</strong> vinayaakmedical@gmail.com
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
