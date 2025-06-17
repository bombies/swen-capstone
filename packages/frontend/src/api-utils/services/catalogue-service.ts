import type { Product } from '@/api-utils/types/product.types';
import { apiClient } from '../api-client';

export class CatalogueService {
	static async getCatalogueProducts(): Promise<Product[]> {
		return apiClient.get<Product[]>('/catalogues');
	}

	static async getMyCatalogue(): Promise<Product[]> {
		return apiClient.get<Product[]>('/catalogues/me');
	}

	static async getCataloguesByMerchant(): Promise<Product[]> {
		return apiClient.get<Product[]>('/catalogues/merchant');
	}
}
