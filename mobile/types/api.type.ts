export interface ApiResponse<T> {
  metadata: T;
  message: string;
  status: number;
}
