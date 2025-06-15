import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Min,
	ValidateNested,
} from 'class-validator';

export class CreateCartItemDto {
	@ApiProperty({
		description: 'Product ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@IsNotEmpty()
	@IsUUID()
	product: string;

	@ApiProperty({
		description: 'Merchant ID',
		example: '123e4567-e89b-12d3-a456-426614174001',
	})
	@IsNotEmpty()
	@IsUUID()
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
		description: 'Customer ID',
		example: '123e4567-e89b-12d3-a456-426614174002',
	})
	@IsNotEmpty()
	@IsUUID()
	customer: string;

	@ApiProperty({
		description: 'Cart items',
		type: [CreateCartItemDto],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateCartItemDto)
	items?: CreateCartItemDto[];

	@ApiProperty({
		description: 'Default shipping address for the cart',
		example: '123 Main St, City, Country',
		required: false,
	})
	@IsOptional()
	@IsString()
	shippingAddress?: string;
}
