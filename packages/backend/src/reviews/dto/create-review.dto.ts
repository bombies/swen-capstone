import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@ApiProperty({
		description: 'User ID who wrote the review',
		example: '507f1f77bcf86cd799439011',
	})
	@IsNotEmpty()
	@IsString()
	user: string;

	@ApiProperty({
		description: 'Product ID being reviewed',
		example: '507f1f77bcf86cd799439012',
	})
	@IsNotEmpty()
	@IsString()
	product: string;

	@ApiProperty({
		description: 'Merchant ID of the product',
		example: '507f1f77bcf86cd799439013',
	})
	@IsNotEmpty()
	@IsString()
	merchant: string;

	@ApiProperty({
		description: 'Rating from 1 to 5',
		example: 4,
		minimum: 1,
		maximum: 5,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number;

	@ApiProperty({
		description: 'Review content',
		example: 'Great product, very satisfied with the quality!',
	})
	@IsNotEmpty()
	@IsString()
	content: string;

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
