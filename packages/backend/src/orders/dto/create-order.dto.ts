import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
	@ApiProperty({
		description: 'Product ID',
		example: '507f1f77bcf86cd799439011',
	})
	@IsNotEmpty()
	@IsUUID()
	product: string;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439012',
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
	quantity: number;

	@ApiProperty({
		description: 'Price of the product',
		example: 99.99,
		minimum: 0,
	})
	@IsNotEmpty()
	@IsNumber()
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

export class CreateOrderDto {
	@ApiProperty({
		description: 'Customer ID',
		example: '507f1f77bcf86cd799439013',
	})
	@IsNotEmpty()
	@IsUUID()
	customer: string;

	@ApiProperty({
		description: 'Order items',
		type: [CreateOrderItemDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	items: CreateOrderItemDto[];

	@ApiProperty({
		description: 'Total number of items in the order',
		example: 5,
		minimum: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	totalItems: number;

	@ApiProperty({
		description: 'Total amount of the order',
		example: 499.95,
		minimum: 0,
	})
	@IsNotEmpty()
	@IsNumber()
	totalAmount: number;

	@ApiProperty({
		description: 'Shipping address for the entire order',
		example: '123 Main St, City, Country',
		required: false,
	})
	@IsOptional()
	@IsString()
	shippingAddress?: string;

	@ApiProperty({
		description: 'Additional notes for the order',
		example: 'Please deliver in the evening',
		required: false,
	})
	@IsOptional()
	@IsString()
	notes?: string;
}
