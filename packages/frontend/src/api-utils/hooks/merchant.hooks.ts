import type { BecomeMerchantDto } from '../types/merchant.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { merchantService } from '../services/merchant-service';

export const useBecomeMerchant = () => {
	return useMutation({
		mutationFn: (data: BecomeMerchantDto) => merchantService.becomeMerchant(data),
	});
};

export const useMyMerchantProfile = () => {
	return useQuery({
		queryKey: ['merchant', 'me'],
		queryFn: () => merchantService.getMyMerchantProfile(),
	});
};

export const useMerchantProfile = (id: string) => {
	return useQuery({
		queryKey: ['merchant', id],
		queryFn: () => merchantService.getMerchantProfile(id),
		enabled: !!id,
	});
};
