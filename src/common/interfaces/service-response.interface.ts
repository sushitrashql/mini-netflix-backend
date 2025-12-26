export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    next?: string | null;
    previous?: string | null;
    [key: string]: unknown;
  };
  statusCode: number;
  timestamp: string;
  traceId?: string;
  path?: string;
  method?: string;
  input?: {
    query?: any;
    params?: any;
    body?: any;
  };
}
