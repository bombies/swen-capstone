import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { RefreshTokenResponse } from '@/api-utils/types/auth.types';
import axios from 'axios';
import { clearTokens, getTokens, setTokens } from '@/lib/auth';
import { logger } from '@/lib/logger';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

class ApiClient {
	private static instance: ApiClient;
	private axiosInstance: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: Array<{
		resolve: (token: string) => void;
		reject: (error: unknown) => void;
	}> = [];

	private constructor() {
		this.axiosInstance = axios.create({
			baseURL: API_URL,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	public static getInstance(): ApiClient {
		if (!ApiClient.instance) {
			ApiClient.instance = new ApiClient();
		}
		return ApiClient.instance;
	}

	private setupInterceptors() {
		// Request interceptor
		this.axiosInstance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const tokens = getTokens();
				if (tokens?.accessToken) {
					config.headers.Authorization = `Bearer ${tokens.accessToken}`;
				}
				return config;
			},
			error => Promise.reject(error),
		);

		// Response interceptor
		this.axiosInstance.interceptors.response.use(
			response => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as ExtendedAxiosRequestConfig;
				if (!originalRequest) {
					return Promise.reject(error);
				}

				// Check if error is due to expired token
				if (
					error.response?.status === 401
					&& (error.response?.data as { message?: string })?.message?.includes('expired token')
					&& !originalRequest._retry
				) {
					if (this.isRefreshing) {
						// If already refreshing, add to queue
						return new Promise((resolve, reject) => {
							this.failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								originalRequest.headers.Authorization = `Bearer ${token}`;
								return this.axiosInstance(originalRequest);
							})
							.catch(err => Promise.reject(err));
					}

					originalRequest._retry = true;
					this.isRefreshing = true;

					try {
						const tokens = getTokens();
						if (!tokens?.refreshToken) {
							throw new Error('No refresh token available');
						}

						// Call refresh token endpoint
						const response = await axios.post<RefreshTokenResponse>(
							`${API_URL}/auth/refresh`,
							{ refreshToken: tokens.refreshToken },
						);

						const { accessToken, refreshToken, tokenId } = response.data;
						setTokens({ accessToken, refreshToken, tokenId });

						// Retry all queued requests
						this.failedQueue.forEach((prom) => {
							prom.resolve(accessToken);
						});

						// Update the original request and retry
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return this.axiosInstance(originalRequest);
					} catch (refreshError: any) {
						if (refreshError.message.includes('No refresh token available'))
							clearTokens();
						else {
							logger.debug('refreshError', refreshError);
							// If refresh fails, reject all queued requests
							this.failedQueue.forEach((prom) => {
								prom.reject(refreshError);
							});

							// Clear tokens and redirect to login
							clearTokens();
							window.location.href = '/auth/login';
							return Promise.reject(refreshError);
						}
					} finally {
						this.isRefreshing = false;
						this.failedQueue = [];
					}
				}

				return Promise.reject(error);
			},
		);
	}

	async get<T>(endpoint: string): Promise<T> {
		const response = await this.axiosInstance.get<T>(endpoint);
		return response.data;
	}

	async post<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await this.axiosInstance.post<T>(endpoint, data);
		return response.data;
	}

	async put<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await this.axiosInstance.put<T>(endpoint, data);
		return response.data;
	}

	async patch<T>(endpoint: string, data: unknown): Promise<T> {
		const response = await this.axiosInstance.patch<T>(endpoint, data);
		return response.data;
	}

	async delete<T>(endpoint: string): Promise<T> {
		const response = await this.axiosInstance.delete<T>(endpoint);
		return response.data;
	}
}

export const apiClient = ApiClient.getInstance();
