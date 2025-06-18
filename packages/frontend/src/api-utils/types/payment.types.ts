export interface CreatePaymentDto {
	order: string;
	customer: string;
	merchant: string;
	amount: number;
	method: PaymentMethod;
}

export interface UpdatePaymentDto {
	status?: PaymentStatus;
	method?: PaymentMethod;
	transactionId?: string;
	errorMessage?: string;
	refundReason?: string;
}

export type PaymentStatus
	= | 'PENDING'
		| 'COMPLETED'
		| 'FAILED'
		| 'REFUNDED';

export type PaymentMethod
	= | 'credit_card'
		| 'debit_card'
		| 'bank_transfer'
		| 'cash';

export interface Payment {
	_id: string;
	order: string;
	customer: string;
	merchant: string;
	amount: number;
	status: PaymentStatus;
	method: PaymentMethod;
	transactionId?: string;
	errorMessage?: string;
	refundReason?: string;
	createdAt: string;
	updatedAt: string;
}

export interface PaymentStats {
	totalAmount: number;
	totalTransactions: number;
	averageAmount: number;
	successRate: number;
}
