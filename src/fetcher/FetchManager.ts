import Http from "./http";
import { HttpResponse, HttpError } from "./http";

class FetchManager implements Http {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor(baseUrl: string, headers?: HeadersInit) {
        this.baseUrl = baseUrl;
        this.headers = headers || {};
    }
    /**
     * @param response Response object from fetch
     * @returns Promise<HttpResponse<T>>
     */
    private async handleResponse<T>(response: Response): Promise<HttpResponse<T>> {
        const text = await response.text();
        if (!response.ok) {
            const error: HttpError = {
                status: response.status,
                message: `HTTP error! status: ${response.status}`,
            };
            throw error;
        }
        const data = dataParser<T>(text);
        return { status: response.status, data };
    }
    /**
     * Fetch GET request
     * @param url string
     * @returns Promise<HttpResponse<T>>
     */
    async get<T = any>(url: string): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'GET',
            headers: this.headers,
        });
        return this.handleResponse<T>(response);
    }

    /**
     * Fetch POST request
     * @param url string
     * @param data any
     * @returns Promise<HttpResponse<T>>
     */
    async post<T = any>(url: string, data: any): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    /**
     * Fetch PUT request
     * @param url string
     * @param data any
     * @returns Promise<HttpResponse<T>>
     */
    async put<T = any>(url: string, data: any): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'PUT',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    /**
     * Fetch DELETE request
     * @param url string
     * @returns Promise<HttpResponse<T>>
     */
    async delete<T = any>(url: string): Promise<HttpResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'DELETE',
            headers: this.headers,
        });
        return this.handleResponse<T>(response);
    }
}

/**
 * Parse JSON string or return string
 * @param text string
 * @returns T
 */
const dataParser = <T>(text: string): T => {
    try {
        return JSON.parse(text) as T;
    } catch {
        return text as unknown as T;
    }
};

export default FetchManager;
