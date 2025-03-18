export interface BaseService<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: number, item: Partial<T>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}