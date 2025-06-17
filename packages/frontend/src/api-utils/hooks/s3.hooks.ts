import type { GenerateUploadUrlRequest } from '../services/s3-service';
import { useMutation } from '@tanstack/react-query';
import { s3Service } from '../services/s3-service';

export const useGetUploadUrl = () => {
	return useMutation({
		mutationFn: (data: GenerateUploadUrlRequest) => s3Service.generateUploadUrl(data),
	});
};
