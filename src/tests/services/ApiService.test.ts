import ApiService from '../../services/ApiService';
import api from '../../services/api';

// Mock the api module
jest.mock('../../services/api');

describe('ApiService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLicenses', () => {
    it('should fetch licenses successfully', async () => {
      // Mock data
      const mockLicenses = [{ idLicence: 1, name: 'Test License' }];
      
      // Setup the mock response
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockLicenses,
        status: 200
      });

      // Call the method
      const result = await ApiService.getLicenses();
      
      // Assertions
      expect(api.get).toHaveBeenCalledWith('/licences');
      expect(result).toEqual(mockLicenses);
    });

    it('should handle error when fetching licenses', async () => {
      // Setup the mock to reject
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.getLicenses()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/licences');
    });
  });

  describe('getClients', () => {
    it('should fetch clients successfully', async () => {
      // Mock data
      const mockClients = [{ idClient: 1, name: 'Test Client' }];
      
      // Setup the mock response
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockClients,
        status: 200
      });

      // Call the method
      const result = await ApiService.getClients();
      
      // Assertions
      expect(api.get).toHaveBeenCalledWith('/clients');
      expect(result).toEqual(mockClients);
    });

    it('should handle error when fetching clients', async () => {
      // Setup the mock to reject
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.getClients()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/clients');
    });
  });

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      // Mock data
      const mockProducts = [{ idProduct: 1, name: 'Test Product' }];
      
      // Setup the mock response
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockProducts,
        status: 200
      });

      // Call the method
      const result = await ApiService.getProducts();
      
      // Assertions
      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    it('should handle error when fetching products', async () => {
      // Setup the mock to reject
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.getProducts()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/products');
    });
  });

  describe('getStatsOverview', () => {
    it('should fetch stats overview successfully', async () => {
      // Mock data
      const mockStats = { totalClients: 10, totalLicenses: 20 };
      
      // Setup the mock response
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockStats,
        status: 200
      });

      // Call the method
      const result = await ApiService.getStatsOverview();
      
      // Assertions
      expect(api.get).toHaveBeenCalledWith('/statistics/overview');
      expect(result).toEqual(mockStats);
    });

    it('should handle error when fetching stats overview', async () => {
      // Setup the mock to reject
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.getStatsOverview()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/statistics/overview');
    });
  });

  describe('updateLicence', () => {
    it('should update a license successfully', async () => {
      // Mock license data with all required properties
      const mockLicense = { 
        idLicence: 1, 
        name: 'Updated License',
        idClient: 1,
        idProduct: 1,
        expiration: new Date(),
        idShop: 1
      };
      
      // Setup the mock response
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: mockLicense,
        status: 200
      });

      // Call the method
      const result = await ApiService.updateLicence(mockLicense);
      
      // Assertions
      expect(api.put).toHaveBeenCalledWith('/licences/1', mockLicense);
      expect(result).toEqual(mockLicense);
    });

    it('should handle error when updating a license', async () => {
      const mockLicense = { 
        idLicence: 1, 
        name: 'Updated License',
        idClient: 1,
        idProduct: 1,
        expiration: new Date(),
        idShop: 1
      };

      // Setup the mock to reject
      (api.put as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.updateLicence(mockLicense)).rejects.toThrow('Network error');
      expect(api.put).toHaveBeenCalledWith('/licences/1', mockLicense);
    });
  });

  describe('updateClient', () => {
    it('should update a client', async () => {
      // Creating a properly typed mock client
      const mockClient = {
        idClient: 1,
        MT4ID: 'client-mt4-id', 
        Nombre: 'Test Client',
        Broker: 'Test Broker',
        Tests: 'Test',
        idShop: 1
      };

      // Mock the API response
      (api.put as jest.Mock).mockResolvedValueOnce({ data: mockClient });

      const result = await ApiService.updateClient(mockClient);

      expect(api.put).toHaveBeenCalledWith('/clients/1', mockClient);
      expect(result).toEqual(mockClient);
    });

    it('should handle errors when updating a client', async () => {
      // Creating a properly typed mock client
      const mockClient = {
        idClient: 1,
        MT4ID: 'client-mt4-id', 
        Nombre: 'Test Client',
        Broker: 'Test Broker',
        Tests: 'Test',
        idShop: 1
      };

      // Mock an API error
      (api.put as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(ApiService.updateClient(mockClient)).rejects.toThrow('Network error');
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      // Mock product data with all required Mt4Product properties
      const mockProduct = { 
        idProduct: 1, 
        Product: 'Updated Product',
        Code: 'PRD-001',
        version: 1,
        idShop: 1,
        DemoDays: 30,
        link: 'https://example.com/product',
        comentario: 'Test comment'
      };
      
      // Setup the mock response
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: mockProduct,
        status: 200
      });

      // Call the method
      const result = await ApiService.updateProduct(mockProduct);
      
      // Assertions
      expect(api.put).toHaveBeenCalledWith('/products/1', mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should handle error when updating a product', async () => {
      // Mock product data with all required Mt4Product properties
      const mockProduct = { 
        idProduct: 1, 
        Product: 'Updated Product',
        Code: 'PRD-001',
        version: 1,
        idShop: 1,
        DemoDays: 30,
        link: 'https://example.com/product',
        comentario: 'Test comment'
      };

      // Setup the mock to reject
      (api.put as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.updateProduct(mockProduct)).rejects.toThrow('Network error');
      expect(api.put).toHaveBeenCalledWith('/products/1', mockProduct);
    });
  });

  describe('updateProductDemoDays', () => {
    it('should update product demo days successfully', async () => {
      // Mock response data
      const mockProduct = { 
        idProduct: 1, 
        name: 'Product',
        DemoDays: 45
      };
      
      // Setup the mock response
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: mockProduct,
        status: 200
      });

      // Call the method
      const result = await ApiService.updateProductDemoDays(1, 45);
      
      // Assertions
      expect(api.put).toHaveBeenCalledWith('/products/1', { DemoDays: 45 });
      expect(result).toEqual(mockProduct);
    });

    it('should handle error when updating product demo days', async () => {
      // Setup the mock to reject
      (api.put as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.updateProductDemoDays(1, 45)).rejects.toThrow('Network error');
      expect(api.put).toHaveBeenCalledWith('/products/1', { DemoDays: 45 });
    });
  });

  describe('createMt4License2', () => {
    it('should create a license successfully', async () => {
      // Mock license data
      const newLicense = { name: 'New License' };
      const createdLicense = { id: 1, name: 'New License' };
      
      // Setup the mock response
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: createdLicense,
        status: 201
      });

      // Call the method
      const result = await ApiService.createMt4License2(newLicense as any);
      
      // Assertions
      expect(api.post).toHaveBeenCalledWith('/licences2', newLicense);
      expect(result).toEqual(createdLicense);
    });

    it('should handle error when creating a license', async () => {
      const newLicense = { name: 'New License' };

      // Setup the mock to reject
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.createMt4License2(newLicense as any)).rejects.toThrow('Network error');
      expect(api.post).toHaveBeenCalledWith('/licences2', newLicense);
    });
  });

  describe('updateMt4License2', () => {
    it('should update mt4 license successfully', async () => {
      // Mock response data
      const updatedLicense = { 
        id: 1, 
        MT4ID: 'NEW-MT4-ID'
      };
      
      // Setup the mock response
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: updatedLicense,
        status: 200
      });

      // Call the method
      const result = await ApiService.updateMt4License2(1, 'NEW-MT4-ID');
      
      // Assertions
      expect(api.put).toHaveBeenCalledWith('/licences2/1', { MT4ID: 'NEW-MT4-ID' });
      expect(result).toEqual(updatedLicense);
    });

    it('should handle error when updating mt4 license', async () => {
      // Setup the mock to reject
      (api.put as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.updateMt4License2(1, 'NEW-MT4-ID')).rejects.toThrow('Network error');
      expect(api.put).toHaveBeenCalledWith('/licences2/1', { MT4ID: 'NEW-MT4-ID' });
    });
  });

  describe('getMt4Licenses2', () => {
    it('should fetch mt4 licenses successfully', async () => {
      // Mock data
      const mockLicenses = [{ id: 1, MT4ID: 'MT4-1' }];
      
      // Setup the mock response
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: mockLicenses,
        status: 200
      });

      // Call the method
      const result = await ApiService.getMt4Licenses2();
      
      // Assertions
      expect(api.get).toHaveBeenCalledWith('/licences2');
      expect(result).toEqual(mockLicenses);
    });

    it('should handle error when fetching mt4 licenses', async () => {
      // Setup the mock to reject
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.getMt4Licenses2()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/licences2');
    });
  });

  describe('deleteMt4License2', () => {
    it('should delete a license successfully', async () => {
      // Setup the mock response
      (api.delete as jest.Mock).mockResolvedValueOnce({
        status: 204
      });

      // Call the method
      await ApiService.deleteMt4License2(1);
      
      // Assertions
      expect(api.delete).toHaveBeenCalledWith('/licences2/1');
    });

    it('should handle error when deleting a license', async () => {
      // Setup the mock to reject
      (api.delete as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Call and expect rejection
      await expect(ApiService.deleteMt4License2(1)).rejects.toThrow('Network error');
      expect(api.delete).toHaveBeenCalledWith('/licences2/1');
    });
  });
});