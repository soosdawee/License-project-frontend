import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Protector = ({ Component }) => {
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    }
  }, [navigate, jwt]);

  return <Component />;
};
