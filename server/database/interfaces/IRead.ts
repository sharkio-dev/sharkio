export interface IRead<T> {
  findAll(userId: string): Promise<T[]>;
  findById(id: string): Promise<T>;
}
