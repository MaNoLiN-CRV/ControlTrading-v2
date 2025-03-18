import { cache } from './cache';

export function Cacheable(cacheKey: string): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): void {
    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      throw new Error('@Cacheable can only be applied to methods');
    }

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
  };
}