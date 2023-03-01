import { request } from "./base";

const authApi = {
  login: (data) => {
    return request("/auth/v1/login", {
      method: "POST",
      data,
    });
  },
  checkToken: () => {
    return request("/auth/v1/check_session", {
      method: "GET",
    });
  },
  logout: () => {
    return request("/auth/v1/logout", {
      method: "POST",
    });
  },
  getCurrentUser: () => {
    return request("/home/v1/users", {
        method: "GET"
    });
  }
};

export default authApi;
