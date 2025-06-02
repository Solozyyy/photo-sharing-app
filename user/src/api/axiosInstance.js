import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";
        console.log(accessToken, "access token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }, (err) => Promise.reject(err)
);

export default axiosInstance;

