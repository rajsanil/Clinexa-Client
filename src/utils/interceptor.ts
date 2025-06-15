import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${token}`,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
