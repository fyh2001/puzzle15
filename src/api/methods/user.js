import { request } from "../index";

const baseURL = "/user";

export default {
  registerByUsernameAndPassword: (data) =>
    request({
      url: baseURL + "/registerByUsernameAndPassword",
      method: "POST",
      data,
    }),
  loginByUsernameAndPassword: (data) =>
    request({
      url: baseURL + "/loginByUsernameAndPassword",
      method: "POST",
      data,
    }),
    findByLoggedInUser: () =>
    request({
      url: baseURL + "/findByLoggedInUser",
      method: "GET",
    }),
    findBestRecordByLoggedInUser: () =>
    request({
      url: baseURL + "/findBestRecordByLoggedInUser",
      method: "GET",
    }),
};
