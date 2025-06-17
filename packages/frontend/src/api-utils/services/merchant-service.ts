import type { BecomeMerchantDto, Merchant } from '../types/merchant.types';
import { apiClient } from '../api-client';

export const merchantService = {
	becomeMerchant: async (data: BecomeMerchantDto): Promise<Merchant> => {
		const response = await apiClient.post<Merchant>('/merchants/become', data);
		return response;
	},

	getMyMerchantProfile: async (): Promise<Merchant> => {
		const response = await apiClient.get<Merchant>('/merchants/me');
		return response;
	},

	getMerchantProfile: async (id: string): Promise<Merchant> => {
		const response = await apiClient.get<Merchant>(`/merchants/${id}`);
		return response;
	},
};
