export interface CreateProductDto {
	name: string;
	description: string;
	price: number;
	category: string;
	images: string[];
	merchant: string;
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
	_id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	images: string[];
	merchant: string;
	stock: number;
	createdAt: string;
	updatedAt: string;
}
