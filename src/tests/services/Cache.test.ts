import Cache from '../../services/Cache';

describe('Cache', () => {
  let cache: Cache<any>;
  
  beforeEach(() => {
    // Create a new cache with a short TTL for testing
    cache = new Cache(1000); // 1 second TTL
    
    // Mock Date.now for consistent testing
    jest.spyOn(Date, 'now').mockImplementation(() => 1000);
    
    // Spy on the delete method after the cache instance is created
    jest.spyOn(cache, 'delete');
    
    // Clear all mocks for clean testing
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('set and get', () => {
    it('should store and retrieve data correctly', () => {
      const testData = { name: 'test data' };
      
      // Set data in cache
      cache.set('testKey', testData);
      
      // Get data from cache
      const result = cache.get('testKey');
      
      // Assert
      expect(result).toEqual(testData);
    });
    
    it('should return null for non-existent keys', () => {
      const result = cache.get('nonExistentKey');
      expect(result).toBeNull();
    });
  });
  
  describe('expiry', () => {
    it('should expire data after TTL and return null', () => {
      const testData = { name: 'test data' };
      
      // Set data in cache
      cache.set('testKey', testData);
      
      // Advance time past TTL
      jest.spyOn(Date, 'now').mockImplementation(() => 2001); // > 1000 + 1000
      
      // Get data after expiry
      const result = cache.get('testKey');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should handle expired entries when accessing them', () => {
      const testData = { name: 'test data' };
      
      // Set data in cache
      cache.set('testKey', testData);
      
      // Advance time past TTL
      jest.spyOn(Date, 'now').mockImplementation(() => 2001);
      
      // Get data after expiry - debería llamar a delete internamente
      cache.get('testKey');
      
      // Assert delete was called
      expect(cache.delete).toHaveBeenCalledWith('testKey');
    });
  });
  
  describe('has', () => {
    it('should return true for existing non-expired keys', () => {
      const testData = { name: 'test data' };
      
      // Set data in cache
      cache.set('testKey', testData);
      
      // Check if key exists
      const result = cache.has('testKey');
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false for expired keys', () => {
      const testData = { name: 'test data' };
      
      // Set data in cache
      cache.set('testKey', testData);
      
      // Advance time past TTL
      jest.spyOn(Date, 'now').mockImplementation(() => 2001);
      
      // Check if key exists after expiry
      const result = cache.has('testKey');
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false for non-existent keys', () => {
      const result = cache.has('nonExistentKey');
      expect(result).toBe(false);
    });
  });
  
  describe('delete', () => {
    it('should remove an entry from the cache', () => {
      const testData = { name: 'test data' };
      
      // Set data in cache
      cache.set('testKey', testData);
      
      // Delete the entry
      cache.delete('testKey');
      
      // Try to get the deleted entry
      const result = cache.get('testKey');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should not throw errors when deleting non-existent keys', () => {
      // This should not throw an error
      expect(() => cache.delete('nonExistentKey')).not.toThrow();
    });
  });
});