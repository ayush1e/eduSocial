import { toast } from 'react-toastify';

// Error handler utility
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  let message = defaultMessage;

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        message = data?.message || 'Invalid request data';
        break;
      case 401:
        message = 'Please log in to continue';
        // Auto redirect handled by axios interceptor
        break;
      case 403:
        message = 'You do not have permission to perform this action';
        break;
      case 404:
        message = 'The requested resource was not found';
        break;
      case 409:
        message = data?.message || 'Conflict: Resource already exists';
        break;
      case 500:
        message = 'Server error. Please try again later';
        break;
      default:
        message = data?.message || defaultMessage;
    }
  } else if (error.request) {
    // Network error
    message = 'Network error. Please check your connection and try again';
  } else {
    // Other error
    message = error.message || defaultMessage;
  }

  console.error('API Error:', error);
  return message;
};

// Success handler
export const handleApiSuccess = (message) => {
  if (toast) {
    toast.success(message);
  }
  console.log('Success:', message);
};

// Loading state manager
export class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = new Set();
  }

  setLoading(key, isLoading) {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners();
  }

  isLoading(key) {
    return this.loadingStates.get(key) || false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.loadingStates));
  }
}

export const loadingManager = new LoadingManager();
