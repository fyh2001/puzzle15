import { request } from "../index";

const baseURL = "/record";

export default {
  create: (data) =>
    request({
      url: baseURL + "/create",
      method: "POST",
      data,
    }),

  getById: () =>
    request({
      url: baseURL + "/getById",
      method: "GET",
    }),

  getByUserId: () =>
    request({
      url: baseURL + "/getByUserId",
      method: "GET",
    }),

    getTop50: () =>
    request({
      url: baseURL + "/getTop50",
      method: "GET",
    }),
};
