import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FactcheckerProtector = ({ Component }) => {
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");
  const userRole = localStorage.getItem("userType");

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    } else if (userRole !== "FACTCHECKER") {
      navigate("/charts");
    }
  }, [navigate, jwt]);

  return <Component />;
};
