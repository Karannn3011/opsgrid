import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Main Axios instance for JSON content
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for the main 'api' instance
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Specialized function for PUT requests with a plain text body.
 * This is used for updating statuses (e.g., shipment or issue status).
 *
 * @param {string} endpoint - The API endpoint to call (e.g., '/shipments/123/status').
 * @param {string} textData - The raw text string to send in the request body.
 * @returns {Promise<axios.AxiosResponse<any>>} - The Axios response promise.
 */
export const putWithTextBody = (endpoint, textData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'text/plain',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return axios.put(`${API_BASE_URL}${endpoint}`, textData, { headers });
};


export default api;