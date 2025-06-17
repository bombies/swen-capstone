import type { Product } from '@/api-utils/types/product.types';

export interface CreateCartItemDto {
	product: string;
	merchant: string;
	quantity: number;
	price: number;
	shippingAddress?: string;
}

export interface CreateCartDto {
	customer: string;
	name: string;
	defaultShippingAddress?: string;
	items?: CreateCartItemDto[];
}

export interface UpdateCartDto {
	items?: CartItem[];
	shippingAddress?: string;
	isAbandoned?: boolean;
	abandonedAt?: Date;
	expiresAt?: Date;
	isCheckedOut?: boolean;
	checkedOutAt?: Date;
	totalItems?: number;
	totalAmount?: number;
	name?: string;
	defaultShippingAddress?: string;
}

export interface CartItem {
	product: string;
	merchant: string;
	quantity: number;
	price: number;
	shippingAddress?: string;
}

export type CartItemWithRefs = Omit<CartItem, 'product'> & {
	product: Product;
};

export interface Cart {
	_id: string;
	customer: string;
	name: string;
	defaultShippingAddress?: string;
	items: CartItem[];
	totalItems: number;
	totalAmount: number;
	isAbandoned: boolean;
	abandonedAt?: Date;
	lastUpdatedAt: Date;
	expiresAt?: Date;
	isCheckedOut: boolean;
	checkedOutAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type CartWithRefs = Omit<Cart, 'items'> & {
	items: CartItemWithRefs[];
};
