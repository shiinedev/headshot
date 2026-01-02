import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

export class APiError extends Error {
  constructor(message: string, public status: number, public error: any) {
    super(message);
    this.name = "APiError";
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios.get<T>("/auth/me",{})

export const api = {
  get: <T = unknown>(endPoint: string, config?: AxiosRequestConfig) =>
    axiosInstance
      .get<ApiResponse<T>>(endPoint, config)
      .then((res) => res.data.data as T),
  post: <T = unknown>(endPoint: string, body?: any, config?: AxiosRequestConfig) =>
    axiosInstance
      .post<ApiResponse<T>>(endPoint, body, config)
      .then((res) => res.data.data as T),
    put: <T = unknown>(endPoint: string, body?: any, config?: AxiosRequestConfig) =>
      axiosInstance
        .put<ApiResponse<T>>(endPoint, body, config)
        .then((res) => res.data.data as T),
    delete: <T = unknown>(endPoint: string, config?: AxiosRequestConfig) =>
      axiosInstance
        .delete<ApiResponse<T>>(endPoint, config)
        .then((res) => res.data.data as T)
};
