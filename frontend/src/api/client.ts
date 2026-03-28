import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Include cookies for auth (must be set to true)
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
    withXSRFToken: true, // Ensure CSRF token is included in requests https://stackoverflow.com/questions/69002516/axios-not-sending-xsrf-token-with-headers
})

export default api;