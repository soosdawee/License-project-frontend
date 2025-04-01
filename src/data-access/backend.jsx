import axios from "axios";

const getToken = () => {
  return localStorage.getItem("jwt");
};

const backend = axios.create({
  baseURL: "http://localhost:8080",
});

backend.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMCIsImV4cCI6MTc0MzU1MjEwMH0.3cDjlVVirwbbVpQrSVVdvxCb7eMpmjrMk3ZwosX8Ml4";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backend;
