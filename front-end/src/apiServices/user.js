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
    unauthorizeAPIInstance.get("/user/getalluser");

export const searchUserByUsername = (formData) =>
    unauthorizeAPIInstance.post("user/searchuserbyusername",{...formData});