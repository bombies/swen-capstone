import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export enum PaymentStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
	CREDIT_CARD = 'credit_card',
	DEBIT_CARD = 'debit_card',
	BANK_TRANSFER = 'bank_transfer',
	CASH = 'cash',
}

@Schema({ timestamps: true })
export class Payment {
	@ApiProperty({
		description: 'Order ID',
		example: '507f1f77bcf86cd799439011',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
	order: Types.ObjectId;

	@ApiProperty({
		description: 'Customer ID',
		example: '507f1f77bcf86cd799439012',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	customer: Types.ObjectId;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439013',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'Payment amount',
		example: 99.99,
	})
	@Prop({ required: true })
	amount: number;

	@ApiProperty({
		description: 'Payment status',
		enum: PaymentStatus,
		example: PaymentStatus.PENDING,
	})
	@Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
	status: PaymentStatus;

	@ApiProperty({
		description: 'Payment method',
		enum: PaymentMethod,
		example: PaymentMethod.CREDIT_CARD,
	})
	@Prop({ type: String, enum: PaymentMethod, required: true })
	method: PaymentMethod;

	@ApiProperty({
		description: 'Transaction ID from payment provider',
		example: 'txn_123456789',
		required: false,
	})
	@Prop()
	transactionId?: string;

	@ApiProperty({
		description: 'Error message if payment failed',
		example: 'Insufficient funds',
		required: false,
	})
	@Prop()
	errorMessage?: string;

	@ApiProperty({
		description: 'Reason for refund',
		example: 'Customer requested refund',
		required: false,
	})
	@Prop()
	refundReason?: string;
}

export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentSchema = SchemaFactory.createForClass(Payment);
