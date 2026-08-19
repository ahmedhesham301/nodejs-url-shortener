import axios from 'axios';

const client = axios.create({
  baseURL: '/api', // Proxied by Nginx or Vite dev server
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important if using session cookies
});

export default client;
