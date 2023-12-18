import { Navigate, useNavigate } from "react-router-dom"
import "./leftBar.scss"
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { DarkModeContext } from "../../contexts/darkModeContext";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function LeftBar() {

  const { toggle, darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault() // prevents refreshing page
    try {
      await logout();
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="leftBar">
      <div className="buttonContainer">
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={toggle}
            />
          }
          label="Dark mode"
          labelPlacement="top"
        />
        <button
          className="logoutButton"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
    </div>
  )
}

export default LeftBar