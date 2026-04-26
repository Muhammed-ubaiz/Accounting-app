import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://accounting-app-hcj4.onrender.com";

console.log("[API] baseURL →", baseURL);

const API = axios.create({
  baseURL,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
