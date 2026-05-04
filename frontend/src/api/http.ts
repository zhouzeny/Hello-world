import axios, { AxiosHeaders } from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("social_pain_point_token") : null;
  config.headers = AxiosHeaders.from(config.headers);

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});
