export default interface Http {
    get<T = any>(url: string): Promise<HttpResponse<T>>;
    post<T = any>(url: string, data: any): Promise<HttpResponse<T>>;
    put<T = any>(url: string, data: any): Promise<HttpResponse<T>>;
    delete<T = any>(url: string): Promise<HttpResponse<T>>;
    updateHeaders(headers: HeadersInit): void;
}

export interface HttpResponse<T> {
    status: number;
    data: T;
}

export interface HttpError {
    status: number;
    message: string;
}