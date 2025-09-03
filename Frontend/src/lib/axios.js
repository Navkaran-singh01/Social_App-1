import axios from "axios";

// Get the backend URL from the environment variables.
// Fall back to localhost for local development.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1";

// Get the backend URL from the environment variables
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1";

// Create an Axios instance with the base URL configured
export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});
