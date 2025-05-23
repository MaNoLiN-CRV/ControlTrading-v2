class Cache<T> {
  private cache: Map<string, { data: T; expiry: number }>;
  private ttl: number; // Time to live in milliseconds

  constructor(ttl: number) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key: string, data: T) {
    // Set the expiry time
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): T | null {
    // Check if the key exists
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }
    // Check if the data is expired
    if (Date.now() > cached.expiry) {
      this.delete(key); // Use the delete method instead of directly calling this.cache.delete
      return null;
    }
    return cached.data;
  }
  delete(key: string) {
    this.cache.delete(key);
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export default Cache;