import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
      const [newPassword, setNewPassword] = useState('');
      const [answer, setAnswer] = useState('');
      const navigate = useNavigate();
      
      const handleSubmit = async (e) => {
          e.preventDefault();
          try{
            const res = await axios.post('/api/v1/auth/forgot-password', {
              email, newPassword, answer
            });
            if(res && res.data.success){
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
    <Layout>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
            <div className="col-md-8">
              <div className="card shadow-lg border-0 rounded-4 p-4">
                <div className="card-body">
                  <h2 className="text-center mb-4 text-danger fw-bold">Reset Password</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      
    
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
                        <label htmlFor="answer" className="form-label">Answer</label>
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="form-control form-control-lg"
                          id="answer"
                          placeholder="Enter your secret answer"
                          required
                        />
                      </div>
    
                      <div className="mb-3 col-md-6">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="form-control form-control-lg"
                          id="password"
                          placeholder="Create a password"
                          required
                        />
                      </div>
    
                     
                    </div>
                    
    
                    <button type="submit" className="btn btn-primary w-100 btn-lg">Change Password</button>
                    <br/>
                    <br/>
                    
                    
                  </form>
                  <p className="mt-4 mb-0 text-center text-muted" style={{ fontSize: "0.9rem" }}>
                    New User? <a href="/register" className="text-danger fw-semibold text-decoration-none"> Create Account</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
    </Layout>
  )
}

export default ForgotPassword
