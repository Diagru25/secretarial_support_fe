import { request } from "./base";

const meetingApi = {
  getParticipants: () => {
    return request("/home/v1/users/participants", {
      method: "GET",
    });
  },
  addMeeting: (data) => {
    return request("/home/v1/meetings", {
      method: "POST",
      data,
    });
  },
  getAll: (params) => {
    return request("/home/v1/meetings", {
      method: "GET",
      params: params,
    });
  },
  getOne: (id) => {
    return request(`/home/v1/meetings/${id}`, {
      method: "GET",
    });
  },
  delete: (id) => {
    return request(`/home/v1/meetings/${id}`, {
      method: "DELETE",
    });
  },
  update: (id, data) => {
    return request(`/home/v1/meetings/${id}`, {
      method: "PUT",
      data,
    });
  },
};

export default meetingApi;
