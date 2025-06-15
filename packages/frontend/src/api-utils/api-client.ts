import type { ApiError } from './types/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiClient {
	private static async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const error: ApiError = await response.json();
			throw new Error(error.message || 'An error occurred');
		}
		return response.json();
	}

	private static getHeaders(includeAuth = true): HeadersInit {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
		};

		if (includeAuth) {
			const token = localStorage.getItem('accessToken');
			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}
		}

		return headers;
	}

	static async get<T>(endpoint: string, includeAuth = true): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'GET',
			headers: this.getHeaders(includeAuth),
		});
		return this.handleResponse<T>(response);
	}

	static async post<T>(endpoint: string, data: unknown, includeAuth = true): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'POST',
			headers: this.getHeaders(includeAuth),
			body: JSON.stringify(data),
		});
		return this.handleResponse<T>(response);
	}

	static async put<T>(endpoint: string, data: unknown, includeAuth = true): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'PUT',
			headers: this.getHeaders(includeAuth),
			body: JSON.stringify(data),
		});
		return this.handleResponse<T>(response);
	}

	static async delete<T>(endpoint: string, includeAuth = true): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'DELETE',
			headers: this.getHeaders(includeAuth),
		});
		return this.handleResponse<T>(response);
	}

	static async patch<T>(endpoint: string, data: unknown, includeAuth = true): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			method: 'PATCH',
			headers: this.getHeaders(includeAuth),
			body: JSON.stringify(data),
		});
		return this.handleResponse<T>(response);
	}
}
