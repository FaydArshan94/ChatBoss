import axios from "axios";

export const api = axios.create({
  baseURL: "https://chatboss-production.up.railway.app/api",
  withCredentials: true,
});
