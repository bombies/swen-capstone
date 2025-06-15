export interface CreatePaymentDto {
	orderId: string;
	amount: number;
	currency: string;
	paymentMethod: string;
}

export interface UpdatePaymentDto {
	status?: PaymentStatus;
	paymentMethod?: string;
}

export type PaymentStatus
	= | 'PENDING'
		| 'COMPLETED'
		| 'FAILED'
		| 'REFUNDED';

export interface Payment {
	id: string;
	orderId: string;
	amount: number;
	currency: string;
	status: PaymentStatus;
	paymentMethod: string;
	createdAt: string;
	updatedAt: string;
}

export interface PaymentStats {
	totalAmount: number;
	totalTransactions: number;
	averageAmount: number;
	successRate: number;
}
