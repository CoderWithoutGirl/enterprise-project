import axios from "axios";

const unauthorizeAPIInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  validateStatus: (status) => status <= 500,
});

const authorizeAPIInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  validateStatus: (status) => status <= 400,
});

unauthorizeAPIInstance.interceptors.request.use((request) => {
  request.headers["Content-Type"] = "application/json";
  return request;
});

export const login = (formData) =>
  unauthorizeAPIInstance.post("/auth/login", { ...formData });
export const register = (formData) =>
  unauthorizeAPIInstance.post("/ath/register", { ...formData });

export const refreshToken = (refreshToken) =>
  unauthorizeAPIInstance.post("/auth/refresh-token", { refreshToken });

export const createDepartment = (formData) =>
  unauthorizeAPIInstance.post("/departments/", { ...formData });
