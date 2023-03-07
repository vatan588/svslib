import axios from "axios";
import cookie from 'react-cookies'

export const domain = process.env.REACT_APP_API_DOMAIN;
export const axiosInstance = axios.create({
    baseURL: domain,
});

axiosInstance.interceptors.request.use(function requestSuccess(config) {
    config.headers["X-Token"] = `bearer ${cookie.load("auth_token")}`;
    return config;
});

axiosInstance.interceptors.response.use(
    function responseSuccess(config) {
        return config;
    },
    function responseError(error) {
        if (error && error.response && error.response.status === 401) {

            alert("Authentication error.");
        }
        if (error && error.response && error.response.status === 403) {

            alert("Authentication error.");
        }
        if (error && error.response && error.response.status === 501) {

        }
        if (error && error.response && error.response.status === 500) {

        }

        return Promise.reject(error);
    }
);