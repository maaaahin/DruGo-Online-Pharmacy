import React,{useState, useEffect} from "react";
import "./PillSpinner.css"; // external CSS
import { useNavigate, useLocation } from "react-router-dom";
const PillSpinner = ({path="login"}) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=> {
    const interval = setInterval(() => {
      setCount((prevCount) => --prevCount);
    }, 1000);

    if (count === 0) {
      clearInterval(interval);
      navigate(`/${path}`,{
        state: { from: location }, // Pass the location state to the login page
        replace: true, // Replace the current entry in the history stack
      }); 
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  },[count,navigate, location, path]); 

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <h1 className="text-primary">If you have not logged in, you will be redirected to login page in <span className="text-danger"> {count} seconds...</span></h1>
      <br/>
      <br/>
      <br/>
      <div className="pill-loader mb-3"></div>
      <div className="text-muted fw-medium">Fetching your medicines...</div>
    </div>
  );
};

export default PillSpinner;
