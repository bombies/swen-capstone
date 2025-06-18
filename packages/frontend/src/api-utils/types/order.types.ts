export interface CreateOrderDto {
	cart: string;
	customer: string;
	items: OrderItem[];
	totalItems: number;
	totalAmount: number;
	shippingAddress: Address;
	notes?: string;
	paymentStatus?: PaymentStatus;
}

export interface UpdateOrderDto {
	items?: OrderItem[];
	totalItems?: number;
	totalAmount?: number;
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
	payment?: string;
	shippingAddress?: Address;
	trackingNumber?: string;
	estimatedDeliveryDate?: Date;
	cancellationReason?: string;
	refundReason?: string;
	notes?: string;
}

export interface OrderItem {
	product: string;
	merchant: string;
	quantity: number;
	price: number;
	shippingAddress?: string;
}

export interface Address {
	street: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

export type OrderStatus
	= | 'PENDING'
		| 'PROCESSING'
		| 'SHIPPED'
		| 'DELIVERED'
		| 'CANCELLED'
		| 'REFUNDED';

export type PaymentStatus
	= | 'PENDING'
		| 'COMPLETED'
		| 'FAILED'
		| 'REFUNDED';

export interface Order {
	_id: string;
	customer: string;
	items: OrderItem[];
	totalItems: number;
	totalAmount: number;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	payment?: string;
	shippingAddress: Address;
	trackingNumber?: string;
	estimatedDeliveryDate?: Date;
	cancellationReason?: string;
	refundReason?: string;
	notes?: string;
	processedAt?: string;
	completedAt?: string;
	cancelledAt?: string;
	refundedAt?: string;
	createdAt: string;
	updatedAt: string;
}
