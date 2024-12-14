import { useQueries, useQuery } from "@tanstack/react-query";
import "./rightBarBlank.scss"
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authContext";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBarBlank = () => {


  return (
    <div className="rightBar">
      <div className="container">
      </div>
    </div>
  )
}

export default RightBarBlank