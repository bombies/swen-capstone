import { Body, Controller, Post } from '@nestjs/common';
import { FileType, GenerateUploadUrlDto } from './dto/generate-upload-url.dto';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
	constructor(private readonly s3Service: S3Service) {}

	@Post('upload-url')
	async generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
		const prefix = this.getPrefixForFileType(dto.fileType);
		const key = this.s3Service.generateObjectKey(prefix, dto.filename, dto.objectId);
		const contentType = this.getContentType(dto.filename);

		const uploadUrl = await this.s3Service.generatePresignedUploadUrl(key, contentType);

		return {
			uploadUrl,
			key,
			contentType,
		};
	}

	private getPrefixForFileType(fileType: FileType): string {
		switch (fileType) {
			case FileType.PRODUCT_IMAGE:
				return 'products';
			case FileType.LETTER_OF_GOOD_STANDING:
				return 'letters';
			case FileType.REVIEW_ATTACHMENT:
				return 'reviews';
			default:
				throw new Error(`Unknown file type: ${fileType}`);
		}
	}

	private getContentType(filename: string): string {
		const extension = filename.split('.').pop()?.toLowerCase();

		switch (extension) {
			case 'jpg':
			case 'jpeg':
				return 'image/jpeg';
			case 'png':
				return 'image/png';
			case 'pdf':
				return 'application/pdf';
			case 'mp4':
				return 'video/mp4';
			default:
				return 'application/octet-stream';
		}
	}
}
