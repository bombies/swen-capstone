export interface CreateProductDto {
	name: string;
	description: string;
	price: number;
	category: string;
	images: string[];
	merchantId: string;
	stock: number;
}

export interface UpdateProductDto {
	name?: string;
	description?: string;
	price?: number;
	category?: string;
	images?: string[];
	stock?: number;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	images: string[];
	merchantId: string;
	stock: number;
	createdAt: string;
	updatedAt: string;
}
