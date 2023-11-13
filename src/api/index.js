import axios from "axios";
import { useUserStore } from "@/store/userStore";

// const baseURL = "http://localhost:8080/api";
// const baseURL = "http://192.168.31.141:8080/api";
const baseURL = "http://139.9.7.92:8081/api";

const request = axios.create({
  baseURL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token || token !== "") {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 暴露所写的内容
export { request, baseURL };
