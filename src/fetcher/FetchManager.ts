import Http from "./http";
import { HttpResponse, HttpError } from "./http";

class FetchManager implements Http {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor(baseUrl: string, headers?: HeadersInit) {
        this.baseUrl = baseUrl;
        this.headers = headers || {};
    }

    async get<T = any>(url: string): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'GET',
            headers: this.headers,
        });

        const text = await response.text();
        if (!response.ok) {
            const error: HttpError = {
                status: response.status,
                message: `HTTP error! status: ${response.status}`,
            };
            throw error;
        }

        try {
            const data = JSON.parse(text) as T;
            return { status: response.status, data };
        } catch {
            return { status: response.status, data: text as unknown as T };
        }
    }

    async post<T = any>(url: string, data: any): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const text = await response.text();
        if (!response.ok) {
            const error: HttpError = {
                status: response.status,
                message: `HTTP error! status: ${response.status}`,
            };
            throw error;
        }

        try {
            const data = JSON.parse(text) as T;
            return { status: response.status, data };
        } catch {
            return { status: response.status, data: text as unknown as T };
        }
    }

    async put<T = any>(url: string, data: any): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'PUT',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const text = await response.text();
        if (!response.ok) {
            const error: HttpError = {
                status: response.status,
                message: `HTTP error! status: ${response.status}`,
            };
            throw error;
        }

        try {
            const data = JSON.parse(text) as T;
            return { status: response.status, data };
        } catch {
            return { status: response.status, data: text as unknown as T };
        }
    }

    async delete<T = any>(url: string): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'DELETE',
            headers: this.headers,
        });

        const text = await response.text();
        if (!response.ok) {
            const error: HttpError = {
                status: response.status,
                message: `HTTP error! status: ${response.status}`,
            };
            throw error;
        }

        try {
            const data = JSON.parse(text) as T;
            return { status: response.status, data };
        } catch {
            return { status: response.status, data: text as unknown as T };
        }
    }
}

export default FetchManager;