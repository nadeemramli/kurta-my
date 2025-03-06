import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleApiError, logError, redirectToErrorPage } from './error-handler';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth headers or other request modifications here
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const errorResponse = handleApiError(error);
    
    // Log the error
    await logError(error, 'API Request Failed');

    // Redirect to appropriate error page
    redirectToErrorPage(errorResponse.statusCode);

    return Promise.reject(errorResponse);
  }
);

export default apiClient; 