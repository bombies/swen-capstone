import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProductDto {
	@ApiProperty({
		description: 'Product name',
		example: 'iPhone 13 Pro',
		required: false,
	})
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		description: 'Product description',
		example: 'Latest iPhone with A15 Bionic chip',
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: 'Product price',
		example: 999.99,
		minimum: 0,
		required: false,
	})
	@IsNumber()
	@Min(0)
	@IsOptional()
	price?: number;

	@ApiProperty({
		description: 'Product stock quantity',
		example: 100,
		minimum: 0,
		required: false,
	})
	@IsNumber()
	@Min(0)
	@IsOptional()
	stock?: number;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439011',
		required: false,
	})
	@IsString()
	@IsOptional()
	merchant?: Types.ObjectId;

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

	@ApiProperty({
		description: 'Product rating',
		example: 4.5,
		minimum: 0,
		required: false,
	})
	@IsNumber()
	@Min(0)
	@IsOptional()
	rating?: number;
}
