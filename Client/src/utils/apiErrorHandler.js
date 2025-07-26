/**
 * Utility functions for handling API errors and responses
 */

export const handleApiError = (error, defaultMessage = "An error occurred") => {
  // Handle different types of errors
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return "Authentication failed. Please log in again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 422:
        return data?.message || "Invalid data provided.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return data?.message || defaultMessage;
    }
  } else if (error.request) {
    // Request was made but no response received
    return "Network error. Please check your connection.";
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

export const isNetworkError = (error) => {
  return error.request && !error.response;
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const isValidationError = (error) => {
  return error.response?.status === 422;
};

export const extractValidationErrors = (error) => {
  if (isValidationError(error)) {
    const data = error.response.data;
    if (data.errors) {
      // Handle validation errors object
      return Object.entries(data.errors).reduce((acc, [field, messages]) => {
        acc[field] = Array.isArray(messages) ? messages[0] : messages;
        return acc;
      }, {});
    }
  }
  return {};
};

export const createApiErrorHandler = (toast) => {
  return (error, customMessage) => {
    const message = handleApiError(error, customMessage);
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };
};

export default {
  handleApiError,
  isNetworkError,
  isAuthError,
  isValidationError,
  extractValidationErrors,
  createApiErrorHandler,
};
