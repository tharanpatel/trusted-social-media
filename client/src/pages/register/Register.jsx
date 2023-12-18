import "./register.scss";
import { Tooltip } from 'react-tooltip'
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Register = () => {

  const [inputs, setInputs] = useState({
    username: "",
    name: "",
    password: "",
  })
  const [successfulRegister, setSuccessfulRegister] = useState(false);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  /* the use of a spread operator (...prev) means all values are kept the same except the one that is 
  being 'focused' on by the user, which will be changed as the user types
  */
  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  const handleClick = async e => {
    e.preventDefault() // stops page from refreshing when button is clicked

    try {
      await axios.post("http://localhost:3001/api/auth/register", inputs)
      console.log("Success")
      setSuccessfulRegister(true);
      setErr(null);
    } catch (err) {
      setErr(err.response.data);
      setSuccessfulRegister(false);
    }
  };

  // redirect to login page upon a successful register
  useEffect(() => {
    if (successfulRegister) {
      setTimeout(() => {
        navigate("/login")
      }, 1000)
    }
  }, [successfulRegister])


  return (
    <div className="register">
      <motion.div className="container"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="left">
          <h1>Register an account!</h1>
          <input type="text"
            placeholder="Username"
            name="username"
            data-tooltip-id="username-tooltip"
            data-tooltip-content="This is what you will use to log in."
            autoComplete="off"
            onChange={handleChange}
          />
          <Tooltip id="username-tooltip" />
          <input
            type="text"
            placeholder="Display name"
            name="name"
            data-tooltip-id="display-name-tooltip"
            data-tooltip-content="This is what other users will see you as."
            autoComplete="off"
            onChange={handleChange}
          />
          <Tooltip id="display-name-tooltip" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="off"
            onChange={handleChange}
          />
          <button className="regButton" onClick={handleClick}>Register</button>
          {successfulRegister && <span>User registered, redirecting to login!</span>}
          {err && <span>{err}</span>}
          <div className="bottomRightMobile">
            <h2>Have an account already?</h2>
            <Link to="/login">
              <button className="loginButton">Login -{">"}</button>
            </Link>
          </div>
        </div>
        <div className="right">
          <div className="topRight">
            <h1>Sign up for <span>trustMe</span></h1>
          </div>
          <div className="bottomRight">
            <h2>Have an account already?</h2>
            <Link to="/login">
              <button className="loginButton">Login -{">"}</button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register