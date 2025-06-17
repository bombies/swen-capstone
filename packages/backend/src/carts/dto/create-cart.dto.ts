import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';

export class CreateCartItemDto {
	@ApiProperty({
		description: 'Product ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsMongoId()
	product: string;

	@ApiProperty({
		description: 'Merchant ID',
		example: '123e4567-e89b-12d3-a456-426614174001',
	})
	@IsNotEmpty()
	@IsMongoId()
	merchant: string;

	@ApiProperty({
		description: 'Quantity of the product',
		example: 2,
		minimum: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	quantity: number;

	@ApiProperty({
		description: 'Price of the product',
		example: 99.99,
		minimum: 0,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price: number;

	@ApiProperty({
		description: 'Shipping address for this item',
		example: '123 Main St, City, Country',
		required: false,
	})
	@IsOptional()
	@IsString()
	shippingAddress?: string;
}

export class CreateCartDto {
	@ApiProperty({
		description: 'The ID of the customer who owns the cart',
		example: '507f1f77bcf86cd799439013',
		type: String,
	})
	@IsMongoId()
	customer: string;

	@ApiProperty({
		description: 'The name of the cart',
		example: 'Birthday Shopping',
		type: String,
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: 'The default shipping address for the cart',
		example: '123 Main St, City, Country',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	defaultShippingAddress?: string;

	@ApiProperty({
		description: 'The items to add to the cart',
		type: [CreateCartItemDto],
		required: false,
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateCartItemDto)
	@IsOptional()
	items?: CreateCartItemDto[];
}
