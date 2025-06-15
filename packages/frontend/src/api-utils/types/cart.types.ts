export interface CreateCartDto {
	customerId: string;
}

export interface UpdateCartDto {
	customerId?: string;
	status?: CartStatus;
}

export interface CreateCartItemDto {
	productId: string;
	merchantId: string;
	quantity: number;
}

export type CartStatus = 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED';

export interface CartItem {
	productId: string;
	merchantId: string;
	quantity: number;
	price: number;
	productName: string;
	productImage: string;
}

export interface Cart {
	id: string;
	customerId: string;
	status: CartStatus;
	items: CartItem[];
	total: number;
	createdAt: string;
	updatedAt: string;
}
