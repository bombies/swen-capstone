import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { PaymentStatus } from 'src/payments/schemas/payment.schema';
import { OrderStatus } from '../enums/order-status.enum';

@Schema({ timestamps: true })
export class OrderItem {
	@ApiProperty({
		description: 'Product ID',
		example: '507f1f77bcf86cd799439011',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
	product: Types.ObjectId;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439012',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'Quantity of the product',
		example: 2,
		minimum: 1,
	})
	@Prop({ required: true })
	quantity: number;

	@ApiProperty({
		description: 'Price of the product',
		example: 99.99,
		minimum: 0,
	})
	@Prop({ required: true })
	price: number;

	@ApiProperty({
		description: 'Shipping address for this item',
		example: '123 Main St, City, Country',
		required: false,
	})
	@Prop()
	shippingAddress?: string;
}

@Schema({ timestamps: true })
export class Order {
	@ApiProperty({
		description: 'Customer ID',
		example: '507f1f77bcf86cd799439013',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	customer: Types.ObjectId;

	@ApiProperty({
		description: 'Order items',
		type: [OrderItem],
	})
	@Prop({ type: [OrderItem], required: true })
	items: OrderItem[];

	@ApiProperty({
		description: 'Total number of items in the order',
		example: 5,
		minimum: 1,
	})
	@Prop({ required: true })
	totalItems: number;

	@ApiProperty({
		description: 'Total amount of the order',
		example: 499.95,
		minimum: 0,
	})
	@Prop({ required: true })
	totalAmount: number;

	@ApiProperty({
		description: 'Order status',
		enum: OrderStatus,
		example: OrderStatus.PENDING,
	})
	@Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
	status: OrderStatus;

	@ApiProperty({
		description: 'Payment status',
		enum: PaymentStatus,
		example: PaymentStatus.PENDING,
	})
	@Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
	paymentStatus: PaymentStatus;

	@ApiProperty({
		description: 'Payment ID',
		example: '507f1f77bcf86cd799439014',
		required: false,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Payment' })
	payment: Types.ObjectId;

	@ApiProperty({
		description: 'Shipping address',
		type: Object,
		example: {
			street: '123 Main St',
			city: 'New York',
			state: 'NY',
			country: 'USA',
			zipCode: '10001',
		},
	})
	@Prop({ type: Object, required: true })
	shippingAddress: {
		street: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
	};

	@ApiProperty({
		description: 'Tracking number for the shipment',
		example: 'TRK123456789',
		required: false,
	})
	@Prop()
	trackingNumber?: string;

	@ApiProperty({
		description: 'Estimated delivery date',
		example: '2024-03-20T00:00:00.000Z',
		required: false,
	})
	@Prop()
	estimatedDeliveryDate?: Date;

	@ApiProperty({
		description: 'Reason for order cancellation',
		example: 'Customer requested cancellation',
		required: false,
	})
	@Prop()
	cancellationReason?: string;

	@ApiProperty({
		description: 'Reason for order refund',
		example: 'Product damaged during shipping',
		required: false,
	})
	@Prop()
	refundReason?: string;

	@ApiProperty({
		description: 'Additional notes for the order',
		example: 'Please deliver in the evening',
		required: false,
	})
	@Prop()
	notes?: string;

	@ApiProperty({
		description: 'Date when the order was processed',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@Prop({ type: Date })
	processedAt: Date;

	@ApiProperty({
		description: 'Date when the order was completed',
		example: '2024-03-20T00:00:00.000Z',
		required: false,
	})
	@Prop({ type: Date })
	completedAt: Date;

	@ApiProperty({
		description: 'Date when the order was cancelled',
		example: '2024-03-16T00:00:00.000Z',
		required: false,
	})
	@Prop({ type: Date })
	cancelledAt: Date;

	@ApiProperty({
		description: 'Date when the order was refunded',
		example: '2024-03-17T00:00:00.000Z',
		required: false,
	})
	@Prop({ type: Date })
	refundedAt: Date;
}

export type OrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);

// Create indexes
OrderSchema.index({ customer: 1 });
OrderSchema.index({ 'items.merchant': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
