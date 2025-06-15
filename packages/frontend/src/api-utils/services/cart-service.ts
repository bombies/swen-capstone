import type {
	Cart,
	CreateCartDto,
	CreateCartItemDto,
	UpdateCartDto,
} from '../types/cart.types';
import { ApiClient } from '../api-client';

export class CartService {
	static async createCart(data: CreateCartDto): Promise<Cart> {
		return ApiClient.post<Cart>('/carts', data);
	}

	static async getAllCarts(): Promise<Cart[]> {
		return ApiClient.get<Cart[]>('/carts');
	}

	static async getCartById(id: string): Promise<Cart> {
		return ApiClient.get<Cart>(`/carts/${id}`);
	}

	static async getCartsByCustomer(customerId: string): Promise<Cart[]> {
		return ApiClient.get<Cart[]>(`/carts/customer/${customerId}`);
	}

	static async updateCart(id: string, data: UpdateCartDto): Promise<Cart> {
		return ApiClient.patch<Cart>(`/carts/${id}`, data);
	}

	static async deleteCart(id: string): Promise<void> {
		return ApiClient.delete<void>(`/carts/${id}`);
	}

	static async addItemToCart(id: string, data: CreateCartItemDto): Promise<Cart> {
		return ApiClient.post<Cart>(`/carts/${id}/items`, data);
	}

	static async removeItemFromCart(
		id: string,
		productId: string,
		merchantId: string,
	): Promise<void> {
		return ApiClient.delete<void>(
			`/carts/${id}/items/${productId}/${merchantId}`,
		);
	}
}
