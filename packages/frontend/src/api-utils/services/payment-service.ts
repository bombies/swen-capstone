import type {
	CreatePaymentDto,
	Payment,
	PaymentStats,
	UpdatePaymentDto,
} from '../types/payment.types';
import { apiClient } from '../api-client';

export class PaymentService {
	static async createPayment(data: CreatePaymentDto): Promise<Payment> {
		return apiClient.post<Payment>('/payments', data);
	}

	static async getAllPayments(): Promise<Payment[]> {
		return apiClient.get<Payment[]>('/payments');
	}

	static async getPaymentById(id: string): Promise<Payment> {
		return apiClient.get<Payment>(`/payments/${id}`);
	}

	static async getPaymentByOrder(orderId: string): Promise<Payment> {
		return apiClient.get<Payment>(`/payments/order/${orderId}`);
	}

	static async getCustomerPayments(): Promise<Payment[]> {
		return apiClient.get<Payment[]>('/payments/customer');
	}

	static async getMerchantPayments(): Promise<Payment[]> {
		return apiClient.get<Payment[]>('/payments/merchant');
	}

	static async updatePayment(id: string, data: UpdatePaymentDto): Promise<Payment> {
		return apiClient.patch<Payment>(`/payments/${id}`, data);
	}

	static async refundPayment(id: string): Promise<Payment> {
		return apiClient.post<Payment>(`/payments/${id}/refund`, {});
	}

	static async getMerchantPaymentStats(): Promise<PaymentStats> {
		return apiClient.get<PaymentStats>('/payments/merchant/stats');
	}
}
