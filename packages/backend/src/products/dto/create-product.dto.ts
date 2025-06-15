import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
	@ApiProperty({
		description: 'Product name',
		example: 'iPhone 13 Pro',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Product description',
		example: 'Latest iPhone with A15 Bionic chip',
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({
		description: 'Product price',
		example: 999.99,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	price: number;

	@ApiProperty({
		description: 'Product stock quantity',
		example: 100,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	stock: number;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'Product categories',
		example: ['Electronics', 'Smartphones'],
		required: false,
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	categories?: string[];

	@ApiProperty({
		description: 'Product images URLs',
		example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
		required: false,
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	images?: string[];

	@ApiProperty({
		description: 'Product active status',
		example: true,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
