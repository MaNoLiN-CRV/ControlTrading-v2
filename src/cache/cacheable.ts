import { cache } from './cache';

export function Cacheable(cacheKey: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `${cacheKey}:${JSON.stringify(args)}`;
      const cachedResult = cache.get(key);

      if (cachedResult) {
        console.log(`[Cache Hit] Key: ${key}`);
        return cachedResult;
      }

      console.log(`[Cache Miss] Key: ${key}`);
      const result = await originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    };

    return descriptor;
  };
}