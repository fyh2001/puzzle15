import axios from "axios";
import { useUserStore } from "@/store/userStore";
import router from "@/router/index";

// const baseURL = "http://localhost:8081/api";
const baseURL = "http://192.168.31.145:8081/api";
// const baseURL = "http://139.9.7.92:8081/api";

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
    const { data } = response;
    if (data.code === 40001) {
      // 未登录
      const userStore = useUserStore();
      userStore.setUser(null);
      userStore.setToken("");

      window.$message.error("请先登录");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else if (data.code === 40002) {
      // 未注册
      window.$message.error("登录过期，请重新登录");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 暴露所写的内容
export { request, baseURL };
