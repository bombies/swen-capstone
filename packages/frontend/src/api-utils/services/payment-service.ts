import type {
	CreatePaymentDto,
	Payment,
	PaymentStats,
	UpdatePaymentDto,
} from '../types/payment.types';
import { ApiClient } from '../api-client';

export class PaymentService {
	static async createPayment(data: CreatePaymentDto): Promise<Payment> {
		return ApiClient.post<Payment>('/payments', data);
	}

	static async getAllPayments(): Promise<Payment[]> {
		return ApiClient.get<Payment[]>('/payments');
	}

	static async getPaymentById(id: string): Promise<Payment> {
		return ApiClient.get<Payment>(`/payments/${id}`);
	}

	static async getPaymentByOrder(orderId: string): Promise<Payment> {
		return ApiClient.get<Payment>(`/payments/order/${orderId}`);
	}

	static async getCustomerPayments(): Promise<Payment[]> {
		return ApiClient.get<Payment[]>('/payments/customer');
	}

	static async getMerchantPayments(): Promise<Payment[]> {
		return ApiClient.get<Payment[]>('/payments/merchant');
	}

	static async updatePayment(id: string, data: UpdatePaymentDto): Promise<Payment> {
		return ApiClient.patch<Payment>(`/payments/${id}`, data);
	}

	static async refundPayment(id: string): Promise<Payment> {
		return ApiClient.post<Payment>(`/payments/${id}/refund`, {});
	}

	static async getMerchantPaymentStats(): Promise<PaymentStats> {
		return ApiClient.get<PaymentStats>('/payments/merchant/stats');
	}
}
