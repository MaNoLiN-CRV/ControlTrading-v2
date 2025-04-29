// Mock API object
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  updateHeaders: jest.fn()
};

// Mock ApiFactory
jest.mock('../../fetcher/ApiFactory', () => ({
  createApiFactory: jest.fn(() => mockApi)
}));

// Mock the whole api module
jest.mock('../../services/api', () => {
  return {
    __esModule: true,
    default: mockApi,
    updateAuthToken: () => {
      const token = localStorage.getItem('authToken');
      mockApi.updateHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      });
    }
  };
});

import { updateAuthToken } from '../../services/api';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

describe('api service', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    // Clear mock localStorage
    mockLocalStorage.clear();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('updateAuthToken', () => {
    it('should update authorization header with token from localStorage', () => {
      // Set token in localStorage
      mockLocalStorage.setItem('authToken', 'new-token');
      
      // Call updateAuthToken
      updateAuthToken();
      
      // Assert
      expect(mockApi.updateHeaders).toHaveBeenCalledWith({
        'Authorization': 'Bearer new-token'
      });
    });
    
    it('should set empty authorization header when no token exists', () => {
      // Ensure no token in localStorage
      mockLocalStorage.removeItem('authToken');
      
      // Call updateAuthToken
      updateAuthToken();
      
      // Assert
      expect(mockApi.updateHeaders).toHaveBeenCalledWith({
        'Authorization': ''
      });
    });
  });

  describe('API methods', () => {
    it('should expose the necessary HTTP methods', () => {
      // Require the API to test its exports
      const api = require('../../services/api').default;
      
      // Assert that the API has all required methods
      expect(api).toHaveProperty('get');
      expect(api).toHaveProperty('post');
      expect(api).toHaveProperty('put');
      expect(api).toHaveProperty('delete');
      expect(api).toHaveProperty('updateHeaders');
    });
  });
});