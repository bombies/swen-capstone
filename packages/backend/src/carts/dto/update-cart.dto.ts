import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import { CreateCartItemDto } from './create-cart.dto';

export class UpdateCartDto {
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

	@ApiProperty({
		description: 'Whether the cart is abandoned',
		example: false,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	isAbandoned?: boolean;

	@ApiProperty({
		description: 'Date when the cart was abandoned',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	abandonedAt?: Date;

	@ApiProperty({
		description: 'Date when the cart expires',
		example: '2024-03-22T00:00:00.000Z',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	expiresAt?: Date;

	@ApiProperty({
		description: 'Whether the cart has been checked out',
		example: false,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	isCheckedOut?: boolean;

	@ApiProperty({
		description: 'Date when the cart was checked out',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	checkedOutAt?: Date;

	@ApiProperty({
		description: 'Total number of items in the cart',
		example: 5,
		minimum: 0,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	totalItems?: number;

	@ApiProperty({
		description: 'Total amount of the cart',
		example: 499.95,
		minimum: 0,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	@Min(0)
	totalAmount?: number;
}
