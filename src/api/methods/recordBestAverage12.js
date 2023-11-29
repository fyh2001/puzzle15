import { request } from "../index";

const baseURL = "/recordBestAverage12";

export default {
  getByUserIdAndEvent: (event) =>
    request({
      url: baseURL + "/getByUserIdAndEvent",
      method: "GET",
      params: {
        event,
      },
    }),
  getTop50ByEvent: (event) =>
    request({
      url: baseURL + "/getTop50ByEvent",
      method: "GET",
      params: {
        event,
      },
    }),
};
