import type {
	CreateProductDto,
	Product,
	UpdateProductDto,
} from '../types/product.types';
import { ApiClient } from '../api-client';

export class ProductService {
	static async createProduct(data: CreateProductDto): Promise<Product> {
		return ApiClient.post<Product>('/products', data);
	}

	static async getAllProducts(): Promise<Product[]> {
		return ApiClient.get<Product[]>('/products');
	}

	static async getProductById(id: string): Promise<Product> {
		return ApiClient.get<Product>(`/products/${id}`);
	}

	static async searchProducts(query: string): Promise<Product[]> {
		return ApiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
	}

	static async getProductsByCategory(category: string): Promise<Product[]> {
		return ApiClient.get<Product[]>(`/products/category/${encodeURIComponent(category)}`);
	}

	static async getProductsByMerchant(merchantId: string): Promise<Product[]> {
		return ApiClient.get<Product[]>(`/products/merchant/${merchantId}`);
	}

	static async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
		return ApiClient.patch<Product>(`/products/${id}`, data);
	}

	static async deleteProduct(id: string): Promise<void> {
		return ApiClient.delete<void>(`/products/${id}`);
	}
}
