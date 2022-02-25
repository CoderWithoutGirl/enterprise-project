import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  validateStatus: (status) => status <= 500,
});

apiInstance.interceptors.request.use((request) => {
  return request;
});

export const tokenRequestInterceptor = async (apiCall, refreshToken) => {
  const { status, data } = await apiCall();
  if (status === 401) {
    refreshToken();
    return await apiCall();
  } else {
    return { status, data };
  }
};

export const login = (formData) =>
  apiInstance.post("/auth/login", { ...formData });
export const register = (formData) =>
  apiInstance.post("/auth/register", { ...formData });

export const refreshToken = (refreshToken) =>
  apiInstance.post("/auth/refresh-token", { refreshToken });

export const getAllUser = (token) =>
  apiInstance.get("/users/", { headers: { Authorization: `Bearer ${token}` } });

export const logout = (refreshToken) => 
  apiInstance.post('/auth/logout', {...refreshToken});

export const getSingleUser = (token, id) =>
  apiInstance.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const searchUserByUsername = (username, token) =>
  apiInstance.get(`users?username=${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Department
export const createDepartment = (formData, token) =>
  apiInstance.post(
    "/departments/",
    { ...formData },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const searchDepartByName = (name, token) =>
  apiInstance.get(`departments?name=${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllDepartment = (token) =>
  apiInstance.get("/departments/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const findDepartmentByID = (token, id) =>
  apiInstance.get(`/departments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateDepartment = (formData, id, token) =>
  apiInstance.put(
    `/departments/${id}`,
    { ...formData },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const uploadExcelCreateUser = (formData, token) =>
  apiInstance.post("/users/uploadexcel", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
    },
  });

export const confirmUserExcel = (filename, token) =>
  apiInstance.get(`/users/confirm/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const cancelUserExcel = (filename, token) =>
  apiInstance.get(`/users/cancel/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Category
export const createCategory = (formData, token) =>
  apiInstance.post("/categories/", { ...formData }, { headers: { Authorization: `Bearer ${token}` } });

export const searchCategoryByName = (name, token) =>
  apiInstance.get(`categories?name=${name}`, { headers: { Authorization: `Bearer ${token}` } });

export const getCategory = (token) =>
  apiInstance.get("/categories/", { headers: { Authorization: `Bearer ${token}` } });

export const findCategoryByID = (token, id) =>
  apiInstance.get(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });

  export const updateCategory = (formData, id, token) =>
  apiInstance.put(`/categories/${id}`, { ...formData }, { headers: { Authorization: `Bearer ${token}` } });
