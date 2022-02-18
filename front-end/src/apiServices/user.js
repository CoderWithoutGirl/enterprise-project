import axios from "axios";

const unauthorizeAPIInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API,
    validateStatus: (status) => status <= 500,
  });

unauthorizeAPIInstance.interceptors.request.use((request) => {
request.headers["Content-Type"] = "application/json";
return request;
});

export const getAllUser = () =>
    unauthorizeAPIInstance.get("/users/");

export const searchUserByUsername = (username) =>
    unauthorizeAPIInstance.get(`users?username=${username}`);