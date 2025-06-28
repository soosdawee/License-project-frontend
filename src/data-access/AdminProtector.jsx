import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminProtector = ({ Component }) => {
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");
  const userRole = localStorage.getItem("userType");

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    } else if (userRole !== "ADMIN") {
      navigate("/charts");
    }
  }, [navigate, jwt]);

  return <Component />;
};
