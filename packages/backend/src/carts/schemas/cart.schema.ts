import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem {
	@ApiProperty({
		description: 'The ID of the product in the cart',
		example: '507f1f77bcf86cd799439011',
		type: String,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
	product: Types.ObjectId;

	@ApiProperty({
		description: 'The ID of the merchant selling the product',
		example: '507f1f77bcf86cd799439012',
		type: String,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'The quantity of the product in the cart',
		example: 2,
		minimum: 1,
		type: Number,
	})
	@Prop({ required: true, type: Number, min: 1 })
	quantity: number;

	@ApiProperty({
		description: 'The price of the product',
		example: 29.99,
		minimum: 0,
		type: Number,
	})
	@Prop({ required: true, type: Number, min: 0 })
	price: number;

	@ApiProperty({
		description: 'The shipping address for this item',
		example: '123 Main St, City, Country',
		required: false,
		type: String,
	})
	@Prop({ type: String })
	shippingAddress?: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
	@ApiProperty({
		description: 'The name of the cart',
		example: 'Birthday Shopping',
		type: String,
	})
	@Prop({ required: true, type: String })
	name: string;

	@ApiProperty({
		description: 'The ID of the customer who owns the cart',
		example: '507f1f77bcf86cd799439013',
		type: String,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	customer: Types.ObjectId;

	@ApiProperty({
		description: 'The items in the cart',
		type: [CartItem],
		example: [
			{
				product: '507f1f77bcf86cd799439011',
				merchant: '507f1f77bcf86cd799439012',
				quantity: 2,
				price: 29.99,
				shippingAddress: '123 Main St, City, Country',
			},
		],
	})
	@Prop({ type: [CartItemSchema], default: [] })
	items: CartItem[];

	@ApiProperty({
		description: 'The total number of items in the cart',
		example: 2,
		type: Number,
	})
	@Prop({ type: Number, default: 0 })
	totalItems: number;

	@ApiProperty({
		description: 'The total amount of the cart',
		example: 59.98,
		type: Number,
	})
	@Prop({ type: Number, default: 0 })
	totalAmount: number;

	@ApiProperty({
		description: 'The default shipping address for the cart',
		example: '123 Main St, City, Country',
		required: false,
		type: String,
	})
	@Prop({ type: String })
	defaultShippingAddress?: string;

	@ApiProperty({
		description: 'Whether the cart has been abandoned',
		example: false,
		type: Boolean,
	})
	@Prop({ type: Boolean, default: false })
	isAbandoned: boolean;

	@ApiProperty({
		description: 'The date when the cart was abandoned',
		example: '2024-03-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@Prop({ type: Date })
	abandonedAt?: Date;

	@ApiProperty({
		description: 'The date when the cart was last updated',
		example: '2024-03-20T10:00:00Z',
		type: Date,
	})
	@Prop({ type: Date })
	lastUpdatedAt: Date;

	@ApiProperty({
		description: 'The date when the cart expires',
		example: '2024-03-27T10:00:00Z',
		required: false,
		type: Date,
	})
	@Prop({ type: Date })
	expiresAt?: Date;

	@ApiProperty({
		description: 'Whether the cart has been checked out',
		example: false,
		type: Boolean,
	})
	@Prop({ type: Boolean, default: false })
	isCheckedOut: boolean;

	@ApiProperty({
		description: 'The date when the cart was checked out',
		example: '2024-03-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@Prop({ type: Date })
	checkedOutAt?: Date;
}

export type CartDocument = HydratedDocument<Cart>;

export const CartSchema = SchemaFactory.createForClass(Cart);
