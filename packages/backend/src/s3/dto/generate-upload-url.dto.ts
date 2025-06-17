import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum FileType {
	PRODUCT_IMAGE = 'product-image',
	LETTER_OF_GOOD_STANDING = 'letter-of-good-standing',
	REVIEW_ATTACHMENT = 'review-attachment',
}

export class GenerateUploadUrlDto {
	@IsString()
	filename: string;

	@IsEnum(FileType)
	fileType: FileType;

	@IsString()
	@IsOptional()
	objectId?: string;
}
