import type {
	CreateOrderDto,
	Order,
	UpdateOrderDto,
} from '../types/order.types';
import { ApiClient } from '../api-client';

export class OrderService {
	static async createOrder(data: CreateOrderDto): Promise<Order> {
		return ApiClient.post<Order>('/orders', data);
	}

	static async getAllOrders(): Promise<Order[]> {
		return ApiClient.get<Order[]>('/orders');
	}

	static async getOrderById(id: string): Promise<Order> {
		return ApiClient.get<Order>(`/orders/${id}`);
	}

	static async getOrdersByCustomer(customerId: string): Promise<Order[]> {
		return ApiClient.get<Order[]>(`/orders/customer/${customerId}`);
	}

	static async getOrdersByMerchant(merchantId: string): Promise<Order[]> {
		return ApiClient.get<Order[]>(`/orders/merchant/${merchantId}`);
	}

	static async updateOrder(id: string, data: UpdateOrderDto): Promise<Order> {
		return ApiClient.patch<Order>(`/orders/${id}`, data);
	}

	static async updateOrderStatus(id: string): Promise<Order> {
		return ApiClient.patch<Order>(`/orders/${id}/status`, {});
	}

	static async cancelOrder(id: string): Promise<Order> {
		return ApiClient.delete<Order>(`/orders/${id}`);
	}
}
