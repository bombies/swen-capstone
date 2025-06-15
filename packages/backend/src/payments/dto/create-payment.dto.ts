import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../schemas/payment.schema';

export class CreatePaymentDto {
	@ApiProperty({
		description: 'Order ID',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	order: string;

	@ApiProperty({
		description: 'Customer ID',
		example: '507f1f77bcf86cd799439012',
	})
	@IsString()
	@IsNotEmpty()
	customer: string;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439013',
	})
	@IsString()
	@IsNotEmpty()
	merchant: string;

	@ApiProperty({
		description: 'Payment amount',
		example: 99.99,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	amount: number;

	@ApiProperty({
		description: 'Payment method',
		enum: PaymentMethod,
		example: PaymentMethod.CREDIT_CARD,
	})
	@IsEnum(PaymentMethod)
	method: PaymentMethod;

	@ApiProperty({
		description: 'Transaction ID from payment provider',
		example: 'txn_123456789',
		required: false,
	})
	@IsString()
	@IsOptional()
	transactionId?: string;
}
