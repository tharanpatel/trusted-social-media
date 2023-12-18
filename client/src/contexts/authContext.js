// Lamadev (2022) React Social Media App design, Source code, https://github.com/safak/youtube2022/tree/react-social-ui

import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Creating a context API
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) //JSON.parse changes 'Auth', which is initially a string, to a boolean value
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:3001/api/auth/login", inputs, {
      withCredentials: true, // needed to allow functionality with cookies
    });

    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post("http://localhost:3001/api/auth/logout", {
      withCredentials: true, // needed to allow functionality with cookies
    });

    setCurrentUser(null);
  };


  // converts user data into a JSON string and stores within the users local storage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}> {/* login is a function that handles the login process  */}
      {children}
    </AuthContext.Provider>
  );
};