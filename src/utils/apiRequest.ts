import { AxiosResponse } from "axios";
import {
  ApiRequestConfig,
  BaseApiResponse,
  HttpMethod,
} from "../types/api.types";
import axiosInstance from "./interceptor";

class ApiService {
  async makeRequest<T = any>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<BaseApiResponse<T>> {
    try {
      let response: AxiosResponse<any>;

      const requestConfig = {
        headers: config?.headers || {},
        params: config?.params || {},
        timeout: config?.timeout || 10000,
      };

      switch (method) {
        case "GET":
          response = await axiosInstance.get(endpoint, requestConfig);
          break;
        case "POST":
          response = await axiosInstance.post(endpoint, data, requestConfig);
          break;
        case "PUT":
          response = await axiosInstance.put(endpoint, data, requestConfig);
          break;
        case "PATCH":
          response = await axiosInstance.patch(endpoint, data, requestConfig);
          break;
        case "DELETE":
          response = await axiosInstance.delete(endpoint, requestConfig);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Handle different response structures
      const responseData = response.data;

      // If response has error property (like your current API)
      if (responseData.error && responseData.error.length > 0) {
        return {
          success: false,
          error: responseData.error,
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: responseData,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error(`API Error [${method} ${endpoint}]:`, error);

      const apiError: BaseApiResponse<T> = {
        success: false,
        error: ["An unexpected error occurred"],
        statusCode: error.response?.status || 500,
      };

      if (error.response?.data) {
        apiError.error = error.response.data.error || [
          error.response.data.message || "Server error",
        ];
      } else if (error.message) {
        apiError.error = [error.message];
      }

      return apiError;
    }
  }

  // Convenience methods
  async get<T = any>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<BaseApiResponse<T>> {
    return this.makeRequest<T>("GET", endpoint, undefined, config);
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<BaseApiResponse<T>> {
    return this.makeRequest<T>("POST", endpoint, data, config);
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<BaseApiResponse<T>> {
    return this.makeRequest<T>("PUT", endpoint, data, config);
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<BaseApiResponse<T>> {
    return this.makeRequest<T>("PATCH", endpoint, data, config);
  }

  async delete<T = any>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<BaseApiResponse<T>> {
    return this.makeRequest<T>("DELETE", endpoint, undefined, config);
  }
}

export const apiService = new ApiService();
