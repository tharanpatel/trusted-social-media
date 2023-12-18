import "./navbar.scss"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";


function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const [search, setSearch] = useState(null);
  const [searchAllUsers, setSearchAllUsers] = useState([]);
  const navigate = useNavigate();

  // Checks database for names to find match with search bar input
  const handleChange = async e => {
    setSearch(e.target.value)
    const res = await axios.get("http://localhost:3001/api/users/find/allUsers", {
      withCredentials: true, // needed for working with cookies
    });
    setSearchAllUsers(res.data);
  };

  const { logout } = useContext(AuthContext);
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
    <div className="navbar">
      <div className="left">
        <Link to="/"
          style={{ textDecoration: 'none', color: '#08A0F5' }}
        >
          <h1>trustme</h1>
        </Link>
      </div>
      <div className="middle">
        <div className="icons">
          <Link to="/">
            <HomeOutlinedIcon
              className="button"
              fontSize="large"
            />
          </Link>
          <ChatBubbleOutlineIcon
            className="button"
            fontSize="large"
          />
          <Link to={`profile/${currentUser.id}`}>
            <AccountCircleOutlinedIcon
              className="button"
              fontSize="large"
              onClick={() => { window.location.href = `/profile/${currentUser.id}` }}
            />
          </Link>
        </div>
      </div>
      <div className="right">
        <button
          className="logoutButton"
          onClick={handleLogout}
        >
          logout
        </button>
        <div className="searchResults">
          <div className="search">
            <SearchOutlinedIcon className="searchButton" />
            <input type="text"
              placeholder="Search trustme..."
              name="search"
              autoComplete="off"
              onFocus={(e) => e.target.placeholder = ""}
              onChange={handleChange}
            />
          </div>
          {search !== null && search !== "" &&
            Object.keys(searchAllUsers).map((item, i) => (
              <div className="searchDropdown" key={i}>
                {
                  search.includes(searchAllUsers[item].name) &&
                  <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    onClick={() => { window.location.href = `/profile/${searchAllUsers[item].id}` }}
                  >
                    <span>
                      {<img src={"/upload/" + searchAllUsers[item].profilePic} />}
                      {searchAllUsers[item].name}
                    </span>
                  </Link>
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar