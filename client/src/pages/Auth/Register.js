import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('/api/v1/auth/register', {
        name, email, password, phone, address, answer
      });
      if(res.data.success){
        toast.success(res.data.message);
        navigate('/login');
      }
      else{
        toast.error(res.data.message);
      }
    }
    catch (error){
      console.log(error);
      toast.error("Something went wrong!");
    }
  };


  return (
    <Layout title={"Register"}>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="card-body">
              <h2 className="text-center mb-4 text-danger fw-bold">📝 Create your account</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control form-control-lg"
                      id="name"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control form-control-lg"
                      id="phone"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="mb-4 col-md-6">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea
                      className="form-control form-control-lg"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      id="address"
                      rows="2"
                      placeholder="Enter your address"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label htmlFor="answer" className="form-label">What is your year of birth?<br/>Remember this to reset your password in future.</label>
                    <input
                      type="number"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="form-control form-control-lg"
                      id="answer"
                      placeholder="YYYY"
                      required
                    />
                  </div>
                </div>

                

                <button type="submit" className="btn btn-danger w-100 btn-lg">Create Account</button>
              </form>
              <p className="mt-4 mb-0 text-center text-muted" style={{ fontSize: "0.9rem" }}>
                Already have an account? <a href="/login" className="text-danger fw-semibold text-decoration-none">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
