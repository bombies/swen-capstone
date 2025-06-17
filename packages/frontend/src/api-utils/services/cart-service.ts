import type {
	Cart,
	CartWithRefs,
	CreateCartDto,
	CreateCartItemDto,
	UpdateCartDto,
} from '../types/cart.types';
import { apiClient } from '../api-client';

export class CartService {
	static async createCart(data: CreateCartDto): Promise<Cart> {
		return apiClient.post<Cart>('/carts', data);
	}

	static async getAllCarts(): Promise<Cart[]> {
		return apiClient.get<Cart[]>('/carts');
	}

	static async getCartById(id: string): Promise<CartWithRefs> {
		return apiClient.get<CartWithRefs>(`/carts/${id}`);
	}

	static async getCartsByCustomer(customer: string): Promise<Cart[]> {
		return apiClient.get<Cart[]>(`/carts/customer/${customer}`);
	}

	static async updateCart(id: string, data: UpdateCartDto): Promise<Cart> {
		return apiClient.patch<Cart>(`/carts/${id}`, data);
	}

	static async deleteCart(id: string): Promise<void> {
		return apiClient.delete<void>(`/carts/${id}`);
	}

	static async addItemToCart(id: string, data: CreateCartItemDto): Promise<Cart> {
		return apiClient.post<Cart>(`/carts/${id}/items`, data);
	}

	static async removeItemFromCart(
		id: string,
		product: string,
		merchant: string,
	): Promise<void> {
		return apiClient.delete<void>(
			`/carts/${id}/items/${product}/${merchant}`,
		);
	}
}
