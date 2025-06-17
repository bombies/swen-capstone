import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CartItem } from '../schemas/cart.schema';

export class UpdateCartDto {
	@ApiProperty({
		description: 'The items in the cart',
		type: [CartItem],
		required: false,
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItem)
	@IsOptional()
	items?: CartItem[];

	@ApiProperty({
		description: 'The name of the cart',
		example: 'Birthday Shopping',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	name?: string;

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
		description: 'Whether the cart has been abandoned',
		example: false,
		required: false,
		type: Boolean,
	})
	@IsBoolean()
	@IsOptional()
	isAbandoned?: boolean;

	@ApiProperty({
		description: 'The date when the cart was abandoned',
		example: '2024-03-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	abandonedAt?: Date;

	@ApiProperty({
		description: 'The date when the cart expires',
		example: '2024-03-27T10:00:00Z',
		required: false,
		type: Date,
	})
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	expiresAt?: Date;

	@ApiProperty({
		description: 'Whether the cart has been checked out',
		example: false,
		required: false,
		type: Boolean,
	})
	@IsBoolean()
	@IsOptional()
	isCheckedOut?: boolean;

	@ApiProperty({
		description: 'The date when the cart was checked out',
		example: '2024-03-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	checkedOutAt?: Date;

	@ApiProperty({
		description: 'The total number of items in the cart',
		example: 2,
		required: false,
		type: Number,
	})
	@IsNumber()
	@IsOptional()
	totalItems?: number;

	@ApiProperty({
		description: 'The total amount of the cart',
		example: 59.98,
		required: false,
		type: Number,
	})
	@IsNumber()
	@IsOptional()
	totalAmount?: number;
}
