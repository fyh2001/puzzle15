import { request } from "../index";

const baseURL = "/websocket";

export default {
  createRoom: () =>
    request({
      url: baseURL + "/createRoom",
      method: "GET",
    }),

  checkRoom: (roomId) =>
    request({
      url: baseURL + "/checkRoom",
      method: "GET",
      params: {
        roomId,
      },
    }),
};
