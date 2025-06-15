export interface CreateOrderDto {
	customerId: string;
	items: OrderItem[];
	shippingAddress: Address;
	paymentMethod: string;
}

export interface UpdateOrderDto {
	status?: OrderStatus;
	shippingAddress?: Address;
	paymentMethod?: string;
}

export interface OrderItem {
	productId: string;
	merchantId: string;
	quantity: number;
	price: number;
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
		| 'CONFIRMED'
		| 'SHIPPED'
		| 'DELIVERED'
		| 'CANCELLED';

export interface Order {
	id: string;
	customerId: string;
	items: OrderItem[];
	total: number;
	status: OrderStatus;
	shippingAddress: Address;
	paymentMethod: string;
	createdAt: string;
	updatedAt: string;
}
