import axios from "axios";
import qs from "qs";

export const request = axios.create({
  baseURL: "/upload",
  headers: {
    "content-type": "application/json",
    paramsSerializer: (params) => qs.stringify(params),
  },
});
