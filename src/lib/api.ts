import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: true, // if you’ll use cookies later
});

// Small helper for GET with query params (page/size)
export const get = async <T>(url: string, params?: Record<string, any>) => {
  const { data } = await api.get<T>(url, { params });
  return data;
};
