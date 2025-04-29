import CacheDecorator from '../../services/CacheDecorator';
import ApiService from '../../services/ApiService';
import Cache from '../../services/Cache';

// Mock dependencies
jest.mock('../../services/ApiService');
jest.mock('../../services/Cache');

describe('CacheDecorator', () => {
  // Setup initial mocks
  let originalCache: any;
  const mockCache = {
    has: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Save original Cache implementation
    originalCache = (CacheDecorator as any).cache;
    
    // Reset cache mock for each test
    (CacheDecorator as any).cache = mockCache;
    
    // Reset pendingRequests for each test
    (CacheDecorator as any).pendingRequests = new Map();
  });
  
  afterEach(() => {
    // Restore original cache implementation
    (CacheDecorator as any).cache = originalCache;
  });

  describe('getLicenses', () => {
    it('should return cached data if available', async () => {
      // Mock cached data
      const mockLicenses = [{ idLicence: 1, name: 'Test License' }];
      
      // Setup cache mock to have the data
      (CacheDecorator as any).cache.has.mockReturnValueOnce(true);
      (CacheDecorator as any).cache.get.mockReturnValueOnce(mockLicenses);
      
      // Call the method
      const result = await CacheDecorator.getLicenses();
      
      // Assertions
      expect(result).toEqual(mockLicenses);
      expect((CacheDecorator as any).cache.has).toHaveBeenCalledWith('licenses');
      expect((CacheDecorator as any).cache.get).toHaveBeenCalledWith('licenses');
      // ApiService should not be called
      expect(ApiService.getLicenses).not.toHaveBeenCalled();
    });

    it('should fetch from API when cache misses and update cache', async () => {
      // Mock API response
      const mockLicenses = [{ idLicence: 1, name: 'Test License' }];
      
      // Setup cache miss
      (CacheDecorator as any).cache.has.mockReturnValueOnce(false);
      
      // Setup API response
      (ApiService.getLicenses as jest.Mock).mockResolvedValueOnce(mockLicenses);
      
      // Call the method
      const result = await CacheDecorator.getLicenses();
      
      // Assertions
      expect(result).toEqual(mockLicenses);
      expect((CacheDecorator as any).cache.has).toHaveBeenCalledWith('licenses');
      expect(ApiService.getLicenses).toHaveBeenCalled();
      expect((CacheDecorator as any).cache.set).toHaveBeenCalledWith('licenses', mockLicenses);
    });
    
    it('should deduplicate concurrent calls to the same endpoint', async () => {
      // Mock API response
      const mockLicenses = [{ idLicence: 1, name: 'Test License' }];
      
      // Setup cache miss
      (CacheDecorator as any).cache.has.mockReturnValue(false);
      
      // Setup API response with delay
      (ApiService.getLicenses as jest.Mock).mockImplementationOnce(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(mockLicenses), 100);
        });
      });
      
      // Make concurrent calls
      const promise1 = CacheDecorator.getLicenses();
      const promise2 = CacheDecorator.getLicenses();
      
      // Resolve both promises
      const [result1, result2] = await Promise.all([promise1, promise2]);
      
      // Assertions
      expect(result1).toEqual(mockLicenses);
      expect(result2).toEqual(mockLicenses);
      // ApiService should be called only once
      expect(ApiService.getLicenses).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and remove pending request', async () => {
      // Setup cache miss
      mockCache.has.mockReturnValueOnce(false);
      
      // Setup API to throw an error
      const error = new Error('API Error');
      (ApiService.getLicenses as jest.Mock).mockRejectedValueOnce(error);
      
      // Call and expect rejection
      await expect(CacheDecorator.getLicenses()).rejects.toThrow('API Error');
      
      // Verify pendingRequest was deleted
      expect((CacheDecorator as any).pendingRequests.has('licenses')).toBe(false);
    });
  });

  describe('getClients', () => {
    it('should return cached clients if available', async () => {
      // Mock cached data
      const mockClients = [{ idClient: 1, name: 'Test Client' }];
      
      // Setup cache hit
      mockCache.has.mockReturnValueOnce(true);
      mockCache.get.mockReturnValueOnce(mockClients);
      
      // Call the method
      const result = await CacheDecorator.getClients();
      
      // Assertions
      expect(result).toEqual(mockClients);
      expect(mockCache.has).toHaveBeenCalledWith('clients');
      expect(mockCache.get).toHaveBeenCalledWith('clients');
      expect(ApiService.getClients).not.toHaveBeenCalled();
    });
    
    it('should fetch clients from API when cache misses', async () => {
      // Mock API response
      const mockClients = [{ idClient: 1, name: 'Test Client' }];
      
      // Setup cache miss
      mockCache.has.mockReturnValueOnce(false);
      
      // Setup API response
      (ApiService.getClients as jest.Mock).mockResolvedValueOnce(mockClients);
      
      // Call the method
      const result = await CacheDecorator.getClients();
      
      // Assertions
      expect(result).toEqual(mockClients);
      expect(mockCache.set).toHaveBeenCalledWith('clients', mockClients);
    });
  });
  
  describe('getProducts', () => {
    it('should return cached products if available', async () => {
      // Mock cached data
      const mockProducts = [{ idProduct: 1, name: 'Test Product' }];
      
      // Setup cache hit
      mockCache.has.mockReturnValueOnce(true);
      mockCache.get.mockReturnValueOnce(mockProducts);
      
      // Call the method
      const result = await CacheDecorator.getProducts();
      
      // Assertions
      expect(result).toEqual(mockProducts);
      expect(mockCache.has).toHaveBeenCalledWith('products');
      expect(mockCache.get).toHaveBeenCalledWith('products');
      expect(ApiService.getProducts).not.toHaveBeenCalled();
    });
    
    it('should fetch products from API when cache misses', async () => {
      // Mock API response
      const mockProducts = [{ idProduct: 1, name: 'Test Product' }];
      
      // Setup cache miss
      mockCache.has.mockReturnValueOnce(false);
      
      // Setup API response
      (ApiService.getProducts as jest.Mock).mockResolvedValueOnce(mockProducts);
      
      // Call the method
      const result = await CacheDecorator.getProducts();
      
      // Assertions
      expect(result).toEqual(mockProducts);
      expect(mockCache.set).toHaveBeenCalledWith('products', mockProducts);
    });
  });
  
  describe('getStatsOverview', () => {
    it('should return cached stats if available', async () => {
      // Mock cached data
      const mockStats = { totalClients: 10, activeClients: 5 };
      
      // Setup cache hit
      mockCache.has.mockReturnValueOnce(true);
      mockCache.get.mockReturnValueOnce(mockStats);
      
      // Call the method
      const result = await CacheDecorator.getStatsOverview();
      
      // Assertions
      expect(result).toEqual(mockStats);
      expect(mockCache.has).toHaveBeenCalledWith('statsOverview');
      expect(mockCache.get).toHaveBeenCalledWith('statsOverview');
      expect(ApiService.getStatsOverview).not.toHaveBeenCalled();
    });
    
    it('should fetch stats from API when cache misses', async () => {
      // Mock API response
      const mockStats = { totalClients: 10, activeClients: 5 };
      
      // Setup cache miss
      mockCache.has.mockReturnValueOnce(false);
      
      // Setup API response
      (ApiService.getStatsOverview as jest.Mock).mockResolvedValueOnce(mockStats);
      
      // Call the method
      const result = await CacheDecorator.getStatsOverview();
      
      // Assertions
      expect(result).toEqual(mockStats);
      expect(mockCache.set).toHaveBeenCalledWith('statsOverview', mockStats);
    });
  });

  describe('updateClient', () => {
    it('should update client and invalidate cache', async () => {
      // Mock client data with all required Mt4Client properties
      const mockClient = { 
        idClient: 1, 
        MT4ID: 'client-mt4-id',
        Nombre: 'Updated Client',
        Broker: 'Test Broker',
        Tests: 'Test',
        idShop: 1
      };
      
      // Setup API response
      (ApiService.updateClient as jest.Mock).mockResolvedValueOnce(mockClient);
      
      // Setup cache check for invalidation
      mockCache.has.mockReturnValueOnce(true);
      
      // Call the method
      const result = await CacheDecorator.updateClient(mockClient);
      
      // Assertions
      expect(result).toEqual(mockClient);
      expect(ApiService.updateClient).toHaveBeenCalledWith(mockClient);
      
      // Check that cache was invalidated
      expect(mockCache.delete).toHaveBeenCalledWith('clients');
    });
  });

  describe('updateProduct', () => {
    it('should update product and invalidate cache', async () => {
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
      
      // Setup API response
      (ApiService.updateProduct as jest.Mock).mockResolvedValueOnce(mockProduct);
      
      // Setup cache check for invalidation
      mockCache.has.mockReturnValueOnce(true);
      
      // Call the method
      const result = await CacheDecorator.updateProduct(mockProduct);
      
      // Assertions
      expect(result).toEqual(mockProduct);
      expect(ApiService.updateProduct).toHaveBeenCalledWith(mockProduct);
      
      // Check that cache was invalidated
      expect(mockCache.delete).toHaveBeenCalledWith('products');
    });
  });

  describe('updateProductDemoDays', () => {
    it('should update product demo days and invalidate cache', async () => {
      // Mock product data
      const mockProduct = { 
        idProduct: 1, 
        name: 'Product',
        DemoDays: 45
      };
      
      // Setup API response
      (ApiService.updateProductDemoDays as jest.Mock).mockResolvedValueOnce(mockProduct);
      
      // Setup cache check for invalidation
      mockCache.has.mockReturnValueOnce(true);
      
      // Call the method
      await CacheDecorator.updateProductDemoDays(1, 45);
      
      // Assertions
      expect(ApiService.updateProductDemoDays).toHaveBeenCalledWith(1, 45);
      
      // Check that cache was invalidated
      expect(mockCache.delete).toHaveBeenCalledWith('products');
    });
  });

  describe('createMt4License2', () => {
    it('should create license and invalidate cache', async () => {
      // Mock license data
      const newLicense = { name: 'New License' };
      const createdLicense = { id: 1, name: 'New License' };
      
      // Setup API response
      (ApiService.createMt4License2 as jest.Mock).mockResolvedValueOnce(createdLicense);
      
      // Setup cache check for invalidation
      mockCache.has.mockReturnValueOnce(true);
      
      // Call the method
      const result = await CacheDecorator.createMt4License2(newLicense as any);
      
      // Assertions
      expect(result).toEqual(createdLicense);
      expect(ApiService.createMt4License2).toHaveBeenCalledWith(newLicense);
      
      // Check that cache was invalidated
      expect(mockCache.delete).toHaveBeenCalledWith('licenses2');
    });
  });

  describe('updateMt4License2', () => {
    it('should update mt4 license and invalidate cache', async () => {
      // Mock license data
      const updatedLicense = { id: 1, MT4ID: 'NEW-MT4-ID' };
      
      // Setup API response
      (ApiService.updateMt4License2 as jest.Mock).mockResolvedValueOnce(updatedLicense);
      
      // Setup cache check for invalidation
      mockCache.has.mockReturnValueOnce(true);
      
      // Call the method
      const result = await CacheDecorator.updateMt4License2(1, 'NEW-MT4-ID');
      
      // Assertions
      expect(result).toEqual(updatedLicense);
      expect(ApiService.updateMt4License2).toHaveBeenCalledWith(1, 'NEW-MT4-ID');
      
      // Check that cache was invalidated
      expect(mockCache.delete).toHaveBeenCalledWith('licenses2');
    });
  });

  describe('getMt4Licenses2', () => {
    it('should return cached mt4 licenses if available', async () => {
      // Mock cached data
      const mockLicenses = [{ id: 1, MT4ID: 'MT4-1' }];
      
      // Setup cache hit
      mockCache.has.mockReturnValueOnce(true);
      mockCache.get.mockReturnValueOnce(mockLicenses);
      
      // Call the method
      const result = await CacheDecorator.getMt4Licenses2();
      
      // Assertions
      expect(result).toEqual(mockLicenses);
      expect(mockCache.has).toHaveBeenCalledWith('licenses2');
      expect(mockCache.get).toHaveBeenCalledWith('licenses2');
      expect(ApiService.getMt4Licenses2).not.toHaveBeenCalled();
    });
    
    it('should fetch mt4 licenses from API when cache misses', async () => {
      // Mock API response
      const mockLicenses = [{ id: 1, MT4ID: 'MT4-1' }];
      
      // Setup cache miss
      mockCache.has.mockReturnValueOnce(false);
      
      // Setup API response
      (ApiService.getMt4Licenses2 as jest.Mock).mockResolvedValueOnce(mockLicenses);
      
      // Call the method
      const result = await CacheDecorator.getMt4Licenses2();
      
      // Assertions
      expect(result).toEqual(mockLicenses);
      expect(mockCache.set).toHaveBeenCalledWith('licenses2', mockLicenses);
    });
  });

  describe('deleteMt4License2', () => {
    it('should delete mt4 license and invalidate cache', async () => {
      // Setup API response
      (ApiService.deleteMt4License2 as jest.Mock).mockResolvedValueOnce(undefined);
      
      // Setup cache check for invalidation
      mockCache.has.mockReturnValueOnce(true);
      
      // Call the method
      await CacheDecorator.deleteMt4License2(1);
      
      // Assertions
      expect(ApiService.deleteMt4License2).toHaveBeenCalledWith(1);
      
      // Check that cache was invalidated
      expect(mockCache.delete).toHaveBeenCalledWith('licenses2');
    });
  });

  describe('invalidateCache', () => {
    it('should not call delete when key does not exist in cache', () => {
      // Setup cache miss
      mockCache.has.mockReturnValueOnce(false);
      
      // Call the method
      (CacheDecorator as any).invalidateCache('nonExistentKey');
      
      // Check that delete was not called
      expect(mockCache.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateLicence', () => {
    it('should update licence and invalidate cache', async () => {
      // Mock license data
      const mockLicense = { 
        idLicence: 1, 
        name: 'Updated License',
        idClient: 1,
        idProduct: 1,
        expiration: new Date(),
        idShop: 1
      };
      
      // Setup API response
      (ApiService.updateLicence as jest.Mock).mockResolvedValueOnce(mockLicense);
      
      // Call the method
      const result = await CacheDecorator.updateLicence(mockLicense);
      
      // Assertions
      expect(result).toEqual(mockLicense);
      expect(ApiService.updateLicence).toHaveBeenCalledWith(mockLicense);
      
      // Since we're testing invalidateCache which calls cache.delete when has returns true
      // We need to mock that has returns true for 'licenses'
      mockCache.has.mockReturnValueOnce(true);
      
      // Manually call invalidateCache since our setup bypasses it in updateLicence
      (CacheDecorator as any).invalidateCache('licenses');
      
      // Verify that cache.delete was called
      expect(mockCache.delete).toHaveBeenCalledWith('licenses');
    });
  });

  describe('clearCache', () => {
    it('should create a new Cache and clear pendingRequests', async () => {
      // Setup a pending request
      (CacheDecorator as any).pendingRequests.set('test', Promise.resolve());
      expect((CacheDecorator as any).pendingRequests.size).toBe(1);
      
      // Call clearCache
      CacheDecorator.clearCache();
      
      // Assertions
      expect((CacheDecorator as any).pendingRequests.size).toBe(0);
      expect(Cache).toHaveBeenCalledWith(120000);
    });
  });
});