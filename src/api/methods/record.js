import { request } from "../index";

const baseURL = "/record";

export default {
  save: (data) =>
    request({
      url: baseURL + "/save",
      method: "POST",
      data,
    }),

  findByUserId: () =>
    request({
      url: baseURL + "/findByUserId",
      method: "GET",
    }),
};
