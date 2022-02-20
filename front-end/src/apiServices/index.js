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
  const {status, data} = await apiCall();
  if(status === 401) {
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
  apiInstance.post("/ath/register", { ...formData });

export const refreshToken = (refreshToken) =>
  apiInstance.post("/auth/refresh-token", { refreshToken });

export const createDepartment = (formData, token) =>
  apiInstance.post("/departments/", { ...formData }, {headers: {Authorization: `Beaer ${token}`}});
  
export const getAllUser = (token) => apiInstance.get("/users/", {headers: {Authorization: `Bearer ${token}`}});

export const searchUserByUsername = (username, token) =>
  apiInstance.get(`users?username=${username}`, {headers: {Authorization: `Bearer ${token}`}});

<<<<<<< HEAD
export const createDepartment = (formData) =>
  unauthorizeAPIInstance.post("/departments/", { ...formData });

export const getAllDepartment = () =>
  unauthorizeAPIInstance.get("/departments/");
=======
export const createCategory = (formData) => {
  apiInstance.post('/categories/', {...formData});
}
>>>>>>> 5d191c8d13663fc171f9981738b014f979a300d5
