import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
	@ApiProperty({
		description: 'Product name',
		example: 'iPhone 13 Pro',
	})
	@Prop({ required: true })
	name: string;

	@ApiProperty({
		description: 'Product description',
		example: 'Latest iPhone with A15 Bionic chip',
	})
	@Prop({ required: true })
	description: string;

	@ApiProperty({
		description: 'Product price',
		example: 999.99,
		minimum: 0,
	})
	@Prop({ required: true })
	price: number;

	@ApiProperty({
		description: 'Product stock quantity',
		example: 100,
		minimum: 0,
	})
	@Prop({ required: true })
	stock: number;

	@ApiProperty({
		description: 'Merchant ID',
		example: '507f1f77bcf86cd799439011',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'Product categories',
		example: ['Electronics', 'Smartphones'],
		default: [],
	})
	@Prop({ type: [String], default: [] })
	categories: string[];

	@ApiProperty({
		description: 'Product images URLs',
		example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
		default: [],
	})
	@Prop({ type: [String], default: [] })
	images: string[];

	@ApiProperty({
		description: 'Product active status',
		example: true,
		default: true,
	})
	@Prop({ default: true })
	isActive: boolean;

	@ApiProperty({
		description: 'Product rating',
		example: 4.5,
		minimum: 0,
		default: 0,
	})
	@Prop({ default: 0 })
	rating: number;

	@ApiProperty({
		description: 'Number of reviews',
		example: 10,
		minimum: 0,
		default: 0,
	})
	@Prop({ default: 0 })
	reviewCount: number;
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
