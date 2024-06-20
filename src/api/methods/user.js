import { request } from "../index";

const baseURL = "/user";

export default {
  register: (data) =>
    request({
      url: baseURL + "/register",
      method: "POST",
      data,
    }),
  login: (data) =>
    request({
      url: baseURL + "/login",
      method: "POST",
      data,
    }),
  getById: (userId) =>
    request({
      url: baseURL + "/getById",
      method: "GET",
      params: { userId },
    }),
  getByLoggedInUser: () =>
    request({
      url: baseURL + "/getByLoggedInUser",
      method: "GET",
    }),
  update: (data) =>
    request({
      url: baseURL + "/update",
      method: "POST",
      data,
    }),
};
