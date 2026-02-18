import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

const BASE_API_URL =
  process.env.NODE_ENV === "production"
  ? process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://headshot-zx0t.onrender.com/api/v1"
  : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

export class APiError extends Error {
  constructor(
    message: string,
    public status: number,
    public error: any,
  ) {
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

const REFRESH_FAILED_KEY = "REFRESH_FAILED_KEY";

const hasRefreshFailed = () => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(REFRESH_FAILED_KEY) === "true";
};

const setRefreshFailed = () => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REFRESH_FAILED_KEY, "true");
};

const clearAuthState = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REFRESH_FAILED_KEY);
};

if (typeof window !== "undefined") {
  clearAuthState();
}

// axios interceptors

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as any;

    // other errors
    if (error.response?.status !== 401) {
      if (error.response) {
        throw new APiError(
          error.response.data.message ||
            error?.message ||
            "unknown error occurred",
          error.response.status,
          error.response.data.error,
        );
      }

      //network or unknown error
      throw new APiError(error?.message || "unknown error occurred", 0, error);
    }

    // handle 401 errors - unauthorized
    const isRefreshEndpoint = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );

    if (isRefreshEndpoint || originalRequest._retry || hasRefreshFailed()) {
      // Just reject

      return Promise.reject();
    }

    originalRequest._retry = true;
    try {
      await axiosInstance.post("/auth/refresh-token");
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      setRefreshFailed();

      Promise.reject(refreshError);
    }
  },
);

export const api = {
  get: <T = unknown>(endPoint: string, config?: AxiosRequestConfig) =>
    axiosInstance
      .get<ApiResponse<T>>(endPoint, config)
      .then((res) => res.data.data as T),
  post: <T = unknown>(
    endPoint: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) =>
    axiosInstance
      .post<ApiResponse<T>>(endPoint, body, config)
      .then((res) => res.data.data as T),
  put: <T = unknown>(
    endPoint: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) =>
    axiosInstance
      .put<ApiResponse<T>>(endPoint, body, config)
      .then((res) => res.data.data as T),
  delete: <T = unknown>(endPoint: string, config?: AxiosRequestConfig) =>
    axiosInstance
      .delete<ApiResponse<T>>(endPoint, config)
      .then((res) => res.data.data as T),
};
