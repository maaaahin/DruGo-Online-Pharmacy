import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import {useNavigate, useLocation} from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [auth, setAuth] = useAuth();
      const navigate = useNavigate();
      const location = useLocation();
      
      const handleSubmit = async (e) => {
          e.preventDefault();
          try{
            const res = await axios.post('/api/v1/auth/login', {
              email, password,
            });
            if(res.data.success){
              toast.success(res.data.message);
              setAuth({
                ...auth,
                user: res.data.user,
                token: res.data.token,
              });
              localStorage.setItem('auth', JSON.stringify(res.data));
              navigate(location.state?.from?.pathname || '/');
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
    <Layout title={"Login"}>
          <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
            <div className="col-md-8">
              <div className="card shadow-lg border-0 rounded-4 p-4">
                <div className="card-body">
                  <h2 className="text-center mb-4 text-danger fw-bold">Login to your account</h2>
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
    
                     
                    </div>
                    
    
                    <button type="submit" className="btn btn-primary w-100 btn-lg">Login</button>
                    <br/>
                    <br/>
                    <button type="button" className="btn btn-danger w-100 btn-lg" onClick={()=>navigate('/forgot-password')}>Forgot Password</button>
                    
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

export default Login
