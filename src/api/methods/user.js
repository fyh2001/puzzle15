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
  getByLoggedInUser: () =>
    request({
      url: baseURL + "/getByLoggedInUser",
      method: "GET",
    }),
};
