import { ErrorResponse } from '@kurta-my/types';
import { supabase } from '@kurta-my/api-client';

export async function logError(error: any, context?: string) {
  if (!process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING) return;

  try {
    const { error: logError } = await supabase
      .from('error_logs')
      .insert([
        {
          error: JSON.stringify(error),
          context,
          timestamp: new Date().toISOString(),
          level: process.env.NEXT_PUBLIC_ERROR_LOG_LEVEL || 'error',
        },
      ]);

    if (logError) {
      console.error('Failed to log error:', logError);
    }
  } catch (e) {
    console.error('Error logging failed:', e);
  }
}

export function handleApiError(error: any): ErrorResponse {
  // Network errors
  if (!error.response) {
    return {
      statusCode: 503,
      message: 'Service unavailable. Please try again later.',
      error,
    };
  }

  // Handle specific status codes
  switch (error.response.status) {
    case 400:
      return {
        statusCode: 400,
        message: 'Bad request. Please check your input.',
        error: error.response.data,
      };
    case 401:
      return {
        statusCode: 401,
        message: 'Unauthorized. Please log in.',
        error: error.response.data,
      };
    case 403:
      return {
        statusCode: 403,
        message: 'Access forbidden.',
        error: error.response.data,
      };
    case 404:
      return {
        statusCode: 404,
        message: 'Resource not found.',
        error: error.response.data,
      };
    case 408:
      return {
        statusCode: 408,
        message: 'Request timeout.',
        error: error.response.data,
      };
    case 409:
      return {
        statusCode: 409,
        message: 'Request conflict.',
        error: error.response.data,
      };
    case 410:
      return {
        statusCode: 410,
        message: 'Resource no longer available.',
        error: error.response.data,
      };
    case 429:
      return {
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
        error: error.response.data,
      };
    case 500:
      return {
        statusCode: 500,
        message: 'Internal server error.',
        error: error.response.data,
      };
    case 502:
      return {
        statusCode: 502,
        message: 'Bad gateway.',
        error: error.response.data,
      };
    case 503:
      return {
        statusCode: 503,
        message: 'Service unavailable.',
        error: error.response.data,
      };
    case 504:
      return {
        statusCode: 504,
        message: 'Gateway timeout.',
        error: error.response.data,
      };
    default:
      return {
        statusCode: 500,
        message: 'An unexpected error occurred.',
        error: error.response.data,
      };
  }
}

export function redirectToErrorPage(statusCode: number) {
  switch (statusCode) {
    case 400:
      window.location.href = '/error-pages/400';
      break;
    case 401:
      window.location.href = '/error-pages/401';
      break;
    case 403:
      window.location.href = '/error-pages/403';
      break;
    case 404:
      window.location.href = '/not-found';
      break;
    case 408:
      window.location.href = '/error-pages/408';
      break;
    case 409:
      window.location.href = '/error-pages/409';
      break;
    case 410:
      window.location.href = '/error-pages/410';
      break;
    case 429:
      window.location.href = '/error-pages/429';
      break;
    case 502:
      window.location.href = '/error-pages/502';
      break;
    case 503:
      window.location.href = '/error-pages/503';
      break;
    case 504:
      window.location.href = '/error-pages/504';
      break;
    case 505:
      window.location.href = '/error-pages/505';
      break;
    case 506:
      window.location.href = '/error-pages/506';
      break;
    default:
      window.location.href = '/error';
  }
} 