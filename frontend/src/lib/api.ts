import axios from "axios";
import { getUserToken, getAdminToken } from "./auth";

const baseURL = import.meta.env.VITE_API_URL as string;

export const apiUser = axios.create({ baseURL });
export const apiAdmin = axios.create({ baseURL });

apiUser.interceptors.request.use((config) => {
  const t = getUserToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

apiAdmin.interceptors.request.use((config) => {
  const t = getAdminToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
