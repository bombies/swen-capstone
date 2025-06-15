import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
	@ApiProperty({
		description: 'User ID who wrote the review',
		example: '507f1f77bcf86cd799439011',
		required: false,
	})
	@IsOptional()
	@IsString()
	user?: string;

	@ApiProperty({
		description: 'Product ID being reviewed',
		example: '507f1f77bcf86cd799439012',
		required: false,
	})
	@IsOptional()
	@IsString()
	product?: string;

	@ApiProperty({
		description: 'Merchant ID of the product',
		example: '507f1f77bcf86cd799439013',
		required: false,
	})
	@IsOptional()
	@IsString()
	merchant?: string;

	@ApiProperty({
		description: 'Rating from 1 to 5',
		example: 4,
		minimum: 1,
		maximum: 5,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(5)
	rating?: number;

	@ApiProperty({
		description: 'Review content',
		example: 'Great product, very satisfied with the quality!',
		required: false,
	})
	@IsOptional()
	@IsString()
	content?: string;

	@ApiProperty({
		description: 'Array of image URLs',
		example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
		type: [String],
		required: false,
	})
	@IsOptional()
	@IsString()
	images?: string[];
}
