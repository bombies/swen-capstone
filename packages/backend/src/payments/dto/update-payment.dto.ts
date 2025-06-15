import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class UpdatePaymentDto {
	@ApiProperty({
		description: 'Payment status',
		enum: PaymentStatus,
		example: PaymentStatus.COMPLETED,
		required: false,
	})
	@IsEnum(PaymentStatus)
	@IsOptional()
	status?: PaymentStatus;

	@ApiProperty({
		description: 'Transaction ID from payment provider',
		example: 'txn_123456789',
		required: false,
	})
	@IsString()
	@IsOptional()
	transactionId?: string;

	@ApiProperty({
		description: 'Error message if payment failed',
		example: 'Insufficient funds',
		required: false,
	})
	@IsString()
	@IsOptional()
	errorMessage?: string;

	@ApiProperty({
		description: 'Reason for refund',
		example: 'Customer requested refund',
		required: false,
	})
	@IsString()
	@IsOptional()
	refundReason?: string;
}
