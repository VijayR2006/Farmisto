import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const instance = axios.create({
  baseURL: import.meta.env.DEV ? API_BASE_URL : 'https://farmisto.onrender.com',
  timeout: 15000,
});

export default instance;
