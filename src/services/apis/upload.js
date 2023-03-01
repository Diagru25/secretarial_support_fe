import axios from "axios";

const uploadApi = {
  upload: (data) => {
    return axios.post("http://192.168.1.125:4444/api/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default uploadApi;
