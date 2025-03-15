interface Http {
  get<T = any>(url: string): Promise<HttpResponse<T>>;
  post<T = any>(url: string, data: any): Promise<HttpResponse<T>>;
  put<T = any>(url: string, data: any): Promise<HttpResponse<T>>;
  delete<T = any>(url: string): Promise<HttpResponse<T>>;
}

type HttpError = {
  status: number;
  message: string;
}

type HttpResponse<T> = {
  status: number;
  data: T;
}

export type { HttpResponse, HttpError };
export default Http;