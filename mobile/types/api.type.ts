export interface ApiResponse<T> {
  metadata: T;
  message: string;
  reason: string;
}
