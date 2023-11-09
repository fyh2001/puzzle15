import axios from "axios";

const baseURL = "http://localhost:8080";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use();

/**
 * 响应拦截器
 */
instance.interceptors.response.use();

// 暴露所写的内容
export { instance as request };
export { baseURL };
