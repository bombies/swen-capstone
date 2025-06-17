import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
	@ApiProperty({
		description: 'Product ID',
		example: '507f1f77bcf86cd799439011',
	})
	@IsNotEmpty()
	@IsMongoId()
	product: string;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439012',
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

export class AddressDto {
	@ApiProperty({
		description: 'Street address',
		example: '123 Main St',
	})
	@IsNotEmpty()
	@IsString()
	street: string;

	@ApiProperty({
		description: 'City',
		example: 'New York',
	})
	@IsNotEmpty()
	@IsString()
	city: string;

	@ApiProperty({
		description: 'State/Province',
		example: 'NY',
	})
	@IsNotEmpty()
	@IsString()
	state: string;

	@ApiProperty({
		description: 'Country',
		example: 'USA',
	})
	@IsNotEmpty()
	@IsString()
	country: string;

	@ApiProperty({
		description: 'ZIP/Postal code',
		example: '10001',
	})
	@IsNotEmpty()
	@IsString()
	zipCode: string;
}

export class CreateOrderDto {
	@ApiProperty({
		description: 'Customer ID',
		example: '507f1f77bcf86cd799439013',
	})
	@IsNotEmpty()
	@IsMongoId()
	customer: string;

	@ApiProperty({
		description: 'Cart ID',
		example: '507f1f77bcf86cd799439013',
	})
	@IsNotEmpty()
	@IsMongoId()
	cart: string;

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
		description: 'Shipping address',
		type: AddressDto,
	})
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => AddressDto)
	shippingAddress: AddressDto;

	@ApiProperty({
		description: 'Additional notes for the order',
		example: 'Please deliver in the evening',
		required: false,
	})
	@IsOptional()
	@IsString()
	notes?: string;
}
