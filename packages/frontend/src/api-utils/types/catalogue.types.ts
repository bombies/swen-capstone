export type CatalogueStatus = 'active' | 'inactive' | 'draft';

export interface CreateCatalogueDto {
	name: string;
	description?: string;
	products?: string[];
	status?: CatalogueStatus;
	isPublic?: boolean;
	publishedAt?: string;
	expiresAt?: string;
	tags?: string[];
}

export interface UpdateCatalogueDto {
	name?: string;
	description?: string;
	products?: string[];
	status?: CatalogueStatus;
	isPublic?: boolean;
	publishedAt?: string;
	expiresAt?: string;
	tags?: string[];
}

export interface RateCatalogueDto {
	rating: number;
}

export interface Catalogue {
	_id: string;
	name: string;
	description?: string;
	merchant: string;
	products: string[];
	status: CatalogueStatus;
	isPublic: boolean;
	publishedAt?: string;
	expiresAt?: string;
	tags: string[];
	viewCount: number;
	productCount: number;
	isFeatured: boolean;
	featuredAt?: string;
	rating: number;
	reviewCount: number;
	createdAt: string;
	updatedAt: string;
}
