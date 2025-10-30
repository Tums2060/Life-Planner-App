import axios from 'axios';

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : "http://localhost:5001/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
})

export default api;