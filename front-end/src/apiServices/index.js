import axios from 'axios';

const API = axios.create({baseURL: "http://localhost:5000/api/v1/"});

API.interceptors.request.use(request => {request.headers['Content-Type']= "application/json";request.validateStatus = (status) => {return status <= 500}; return request;})

export const login = (formData) => API.post('/auth/login', {...formData});
export const register = (formData) => API.post('/ath/register', {...formData})