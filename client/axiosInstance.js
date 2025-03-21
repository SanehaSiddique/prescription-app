import axios from "axios";

const API = axios.create({
    baseURL: "http://wwwtest.mexi.care/api", // set the backend link
});

// Automatically include token in every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("Sending Token:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
