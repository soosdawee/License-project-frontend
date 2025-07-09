import axios from "axios";

const getToken = () => {
  return localStorage.getItem("jwt");
};

const backend = axios.create({
  baseURL: "http://backend-service.localhost",
});

backend.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token !== undefined && token !== null) {
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
