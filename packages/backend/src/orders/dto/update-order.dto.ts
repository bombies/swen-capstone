import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsEnum,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { PaymentStatus } from 'src/payments/schemas/payment.schema';
import { AddressDto, CreateOrderItemDto } from './create-order.dto';

export class UpdateOrderDto {
	@ApiProperty({
		description: 'Order items',
		type: [CreateOrderItemDto],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	items?: CreateOrderItemDto[];

	@ApiProperty({
		description: 'Total number of items in the order',
		example: 5,
		minimum: 1,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	totalItems?: number;

	@ApiProperty({
		description: 'Total amount of the order',
		example: 499.95,
		minimum: 0,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	totalAmount?: number;

	@ApiProperty({
		description: 'Order status',
		enum: OrderStatus,
		example: OrderStatus.PROCESSING,
		required: false,
	})
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus;

	@ApiProperty({
		description: 'Payment status',
		enum: PaymentStatus,
		example: PaymentStatus.COMPLETED,
		required: false,
	})
	@IsOptional()
	@IsEnum(PaymentStatus)
	paymentStatus?: PaymentStatus;

	@ApiProperty({
		description: 'Payment ID',
		example: '507f1f77bcf86cd799439014',
		required: false,
	})
	@IsOptional()
	@IsMongoId()
	payment?: string;

	@ApiProperty({
		description: 'Shipping address',
		type: AddressDto,
		required: false,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => AddressDto)
	shippingAddress?: AddressDto;

	@ApiProperty({
		description: 'Tracking number for the shipment',
		example: 'TRK123456789',
		required: false,
	})
	@IsOptional()
	@IsString()
	trackingNumber?: string;

	@ApiProperty({
		description: 'Estimated delivery date',
		example: '2024-03-20T00:00:00.000Z',
		required: false,
	})
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	estimatedDeliveryDate?: Date;

	@ApiProperty({
		description: 'Reason for order cancellation',
		example: 'Customer requested cancellation',
		required: false,
	})
	@IsOptional()
	@IsString()
	cancellationReason?: string;

	@ApiProperty({
		description: 'Reason for order refund',
		example: 'Product damaged during shipping',
		required: false,
	})
	@IsOptional()
	@IsString()
	refundReason?: string;

	@ApiProperty({
		description: 'Additional notes for the order',
		example: 'Please deliver in the evening',
		required: false,
	})
	@IsOptional()
	@IsString()
	notes?: string;
}
