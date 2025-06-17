import { apiClient } from '../api-client';

export interface GenerateUploadUrlRequest {
	filename: string;
	fileType: 'product-image' | 'letter-of-good-standing' | 'review-attachment';
	objectId?: string;
}

export interface GenerateUploadUrlResponse {
	uploadUrl: string;
	key: string;
	contentType: string;
}

export const s3Service = {
	generateUploadUrl: async (data: GenerateUploadUrlRequest): Promise<string> => {
		const response = await apiClient.post<GenerateUploadUrlResponse>('/s3/upload-url', data);
		return response.uploadUrl;
	},
};
