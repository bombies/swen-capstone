import { useSingleMediaUploader } from '@/hooks/media-upload-hooks';
import { useGetUploadUrl } from './s3.hooks';

export const useReviewAttachmentUpload = () => {
	const { mutateAsync: fetchUrl } = useGetUploadUrl();
	return useSingleMediaUploader<string, Error, { fileExtension: string; objectKey: string }>(
		async ({ fileExtension, objectKey }) => {
			return fetchUrl({
				filename: `${objectKey}.${fileExtension}`,
				fileType: 'review-attachment',
				objectId: objectKey,
			});
		},
	);
};
