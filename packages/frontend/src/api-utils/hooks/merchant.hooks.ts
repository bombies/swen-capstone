import type { BecomeMerchantDto } from '../types/merchant.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { useSingleMediaUploader } from '@/hooks/media-upload-hooks';
import { merchantService } from '../services/merchant-service';
import { useGetUploadUrl } from './s3.hooks';

export const useBecomeMerchant = () => {
	return useMutation({
		mutationFn: (data: BecomeMerchantDto) => merchantService.becomeMerchant(data),
	});
};

export const useMyMerchantProfile = () => {
	const auth = useAuth();
	return useQuery({
		queryKey: ['merchant', 'me'],
		queryFn: () => merchantService.getMyMerchantProfile(),
		enabled: auth.isAuthenticated && auth.user?.activeRole === 'merchant',
	});
};

export const useMerchantProfile = (id: string) => {
	return useQuery({
		queryKey: ['merchant', id],
		queryFn: () => merchantService.getMerchantProfile(id),
		enabled: !!id,
	});
};

export const useLetterOfGoodStandingUpload = () => {
	const { mutateAsync: fetchUrl } = useGetUploadUrl();
	return useSingleMediaUploader<string, Error, { fileExtension: string; objectKey: string }>(
		async ({ fileExtension, objectKey }) => {
			return fetchUrl({
				filename: `${objectKey}.${fileExtension}`,
				fileType: 'letter-of-good-standing',
				objectId: objectKey,
			});
		},
	);
};
