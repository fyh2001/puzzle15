import { request } from "../index";

const baseURL = "/record";

export default {
  create: (data) =>
    request({
      url: baseURL + "/create",
      method: "POST",
      data: data.post,
      params: { ...data.params }
    }),

  getById: (id) =>
    request({
      url: baseURL + "/getById",
      method: "GET",
      params: { id },
    }),

    getByUserIdWithPaginate: (pagination) =>
    request({
      url: baseURL + "/getByUserIdWithPaginate",
      method: "GET",
      params: {
        ...pagination
      },
    }),

    getTop50: () =>
    request({
      url: baseURL + "/getTop50",
      method: "GET",
    }),
};
