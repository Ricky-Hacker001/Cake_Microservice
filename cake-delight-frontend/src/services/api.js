import axios from "axios";
import.meta.env.VITE_API_BASE_URL

export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});