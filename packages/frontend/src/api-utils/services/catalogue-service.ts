import type {
	Catalogue,
	CreateCatalogueDto,
	RateCatalogueDto,
	UpdateCatalogueDto,
} from '../types/catalogue.types';
import { apiClient } from '../api-client';

export class CatalogueService {
	static async createCatalogue(data: CreateCatalogueDto): Promise<Catalogue> {
		return apiClient.post<Catalogue>('/catalogues', data);
	}

	static async getAllCatalogues(): Promise<Catalogue[]> {
		return apiClient.get<Catalogue[]>('/catalogues');
	}

	static async getMyCatalogue(): Promise<Catalogue | null> {
		return apiClient.get<Catalogue | null>('/catalogues/me');
	}

	static async getCataloguesByMerchant(): Promise<Catalogue[]> {
		return apiClient.get<Catalogue[]>('/catalogues/merchant');
	}

	static async getCatalogueById(id: string): Promise<Catalogue> {
		return apiClient.get<Catalogue>(`/catalogues/${id}`);
	}

	static async updateCatalogue(id: string, data: UpdateCatalogueDto): Promise<Catalogue> {
		return apiClient.patch<Catalogue>(`/catalogues/${id}`, data);
	}

	static async deleteCatalogue(id: string): Promise<void> {
		await apiClient.delete(`/catalogues/${id}`);
	}

	static async addProductToCatalogue(catalogueId: string, productId: string): Promise<Catalogue> {
		return apiClient.post<Catalogue>(
			`/catalogues/${catalogueId}/products/${productId}`,
			{},
		);
	}

	static async removeProductFromCatalogue(catalogueId: string, productId: string): Promise<Catalogue> {
		return apiClient.delete<Catalogue>(
			`/catalogues/${catalogueId}/products/${productId}`,
		);
	}

	static async publishCatalogue(id: string): Promise<Catalogue> {
		return apiClient.post<Catalogue>(`/catalogues/${id}/publish`, {});
	}

	static async unpublishCatalogue(id: string): Promise<Catalogue> {
		return apiClient.post<Catalogue>(`/catalogues/${id}/unpublish`, {});
	}

	static async incrementViewCount(id: string): Promise<Catalogue> {
		return apiClient.post<Catalogue>(`/catalogues/${id}/view`, {});
	}

	static async rateCatalogue(id: string, data: RateCatalogueDto): Promise<Catalogue> {
		return apiClient.post<Catalogue>(`/catalogues/${id}/rate`, data);
	}
}
