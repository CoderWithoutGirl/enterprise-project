import axios from "axios";



const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  validateStatus: (status) => status <= 500,
});

apiInstance.interceptors.request.use((request) => {
  request.headers["Content-Type"] = "application/json";
  return request;
});

export const tokenRequestInterceptor = async (apiCall, refreshToken) => {
  const { status, data } = await apiCall();
  if (status === 401) {
    refreshToken();
    return await apiCall();
  }
  else {
    return { status, data };
  }
}

export const login = (formData) =>
  apiInstance.post("/auth/login", { ...formData });
export const register = (formData) =>
  apiInstance.post("/auth/register", { ...formData });

export const refreshToken = (refreshToken) =>
  apiInstance.post("/auth/refresh-token", { refreshToken });


export const getAllUser = (token) => apiInstance.get("/users/", { headers: { Authorization: `Bearer ${token}` } });

export const getSingleUser = (token, id) => apiInstance.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const searchUserByUsername = (username, token) =>
  apiInstance.get(`users?username=${username}`, { headers: { Authorization: `Bearer ${token}` } });

export const assignStaff = (formData, id, token) =>
  apiInstance.put(`/users/${id}`, { ...formData }, { headers: { Authorization: `Bearer ${token}` } });

export const createDepartment = (formData, token) =>
  apiInstance.post("/departments/", { ...formData }, { headers: { Authorization: `Bearer ${token}` } });

export const searchDepartByName = (name, token) =>
  apiInstance.get(`departments?name=${name}`, { headers: { Authorization: `Bearer ${token}` } });

export const getAllDepartment = (token) =>
  apiInstance.get("/departments/", { headers: { Authorization: `Bearer ${token}` } });

export const findDepartmentByID = (token, id) =>
  apiInstance.get(`/departments/${id}`, { headers: { Authorization: `Bearer ${token}` } });


export const updateDepartment = (formData, id, token) =>
  apiInstance.put(`/departments/${id}`, { ...formData }, { headers: { Authorization: `Bearer ${token}` } });

export const getCategory = async () => {
  const result = await apiInstance.get("/categories/");
  return result;
}

export const searchCategoryByName = (name) =>
  apiInstance.get(`categories?name=${name}`);
export const createCategory = (formData) => {
  apiInstance.post('/categories/', { ...formData });
}
