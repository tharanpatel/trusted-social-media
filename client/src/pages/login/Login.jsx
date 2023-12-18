import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import "./login.scss";
import { motion } from "framer-motion";


const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  })

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  /* the use of a spread operator (...prev) means all values are kept the same except the one that is 
  being 'focused' on by the user, which will be changed as the user types
  */
  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault() // prevents refreshing page
    try {
      await login(inputs);
      navigate("/"); // Redirects user to homepage upon succesful login
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <motion.div className="container"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="left">
          <h1>Welcome to <span>trustMe</span></h1>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} autoComplete="off" />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} autoComplete="off" />
            <span>forgotten password?</span>
            {err && err}
            <div className="buttons">
              <button className="loginButton" onClick={handleLogin}>Login!</button>
              <Link to="/register">
                <button className="regButton">Register</button>
              </Link>

            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login