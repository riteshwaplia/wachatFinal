// src/utils/api.js
import axios from 'axios';

// --- 1. Base URL Configuration ---
// Use environment variables for flexibility across development and production
// VITE_API_BASE_URL should be defined in your my-mern-client/.env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // --- 2. Default Headers ---
    // Essential for your multi-tenant setup during local development
    'X-Tenant-Domain': 'default-tenant.localhost', // Adjust this to your default local dev tenant
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Request timeout in milliseconds (e.g., 15 seconds)
  withCredentials: true, // If you're using cookies/sessions with your backend
});

// --- 3. Request Interceptors: Modify outgoing requests ---
api.interceptors.request.use(
  (config) => {
    // Attempt to get the authentication token
    const token = localStorage.getItem('authToken'); // Adjust if you store token differently (e.g., in a state management library)

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // You could also add other common headers here, like User-Agent or custom tracking IDs

    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before request is sent)
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// --- 4. Response Interceptors: Process incoming responses ---
api.interceptors.response.use(
  (response) => {
    // Any successful response processing (e.g., logging)
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // --- Global Error Handling ---
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('Bad Request:', data.message || data);
          // Potentially show a toast notification for validation errors
          break;
        case 401:
          console.error('Unauthorized (401):', data.message || data);
          // This is critical for authentication.
          // If it's a token expiry, you might try to refresh the token.
          // For now, let's just log out the user or redirect to login.
          localStorage.removeItem('authToken'); // Clear expired/invalid token
          // You might trigger a global logout action here
          window.location.href = '/login'; // Redirect to login page
          break;
        case 403:
          console.error('Forbidden (403): You do not have permission:', data.message || data);
          // Show an access denied message
          break;
        case 404:
          console.error('Not Found (404):', originalRequest.url, data.message || data);
          // Show a "resource not found" message
          break;
        case 500:
          console.error('Server Error (500):', data.message || 'Something went wrong on the server.');
          // Show a generic server error message
          break;
        default:
          console.error(`Unhandled API Error ${status}:`, data.message || error.message);
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network down, CORS issue)
      console.error('API No Response Error:', 'No response received from server. Check network connection or CORS setup.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;