import type {
	CreateProductDto,
	Product,
	UpdateProductDto,
} from '../types/product.types';
import { apiClient } from '../api-client';

export class ProductService {
	static async createProduct(data: CreateProductDto): Promise<Product> {
		return apiClient.post<Product>('/products', data);
	}

	static async getAllProducts(): Promise<Product[]> {
		return apiClient.get<Product[]>('/products');
	}

	static async getProductById(id: string): Promise<Product> {
		return apiClient.get<Product>(`/products/${id}`);
	}

	static async searchProducts(query: string): Promise<Product[]> {
		return apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
	}

	static async getProductsByCategory(category: string): Promise<Product[]> {
		return apiClient.get<Product[]>(`/products/category/${encodeURIComponent(category)}`);
	}

	static async getProductsByMerchant(merchantId: string): Promise<Product[]> {
		return apiClient.get<Product[]>(`/products/merchant/${merchantId}`);
	}

	static async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
		return apiClient.patch<Product>(`/products/${id}`, data);
	}

	static async deleteProduct(id: string): Promise<void> {
		return apiClient.delete<void>(`/products/${id}`);
	}
}
