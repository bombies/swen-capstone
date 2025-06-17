import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export enum CatalogueStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	DRAFT = 'draft',
}

@Schema({ timestamps: true })
export class Catalogue {
	@ApiProperty({
		description: 'The name of the catalogue',
		example: 'Summer Collection 2024',
		type: String,
	})
	@Prop({ required: true })
	name: string;

	@ApiProperty({
		description: 'The description of the catalogue',
		example: 'A collection of summer essentials for the season',
		required: false,
		type: String,
	})
	@Prop()
	description?: string;

	@ApiProperty({
		description: 'The ID of the merchant who owns the catalogue',
		example: '507f1f77bcf86cd799439012',
		type: String,
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Merchant', required: true, unique: true })
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'The list of product IDs in the catalogue',
		example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439013'],
		type: [String],
	})
	@Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
	products: Types.ObjectId[];

	@ApiProperty({
		description: 'The status of the catalogue',
		enum: CatalogueStatus,
		example: CatalogueStatus.DRAFT,
	})
	@Prop({ required: true, enum: CatalogueStatus, default: CatalogueStatus.DRAFT })
	status: CatalogueStatus;

	@ApiProperty({
		description: 'Whether the catalogue is public',
		example: false,
		type: Boolean,
	})
	@Prop({ type: Boolean, default: false })
	isPublic: boolean;

	@ApiProperty({
		description: 'The date when the catalogue was published',
		example: '2024-03-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@Prop({ type: Date })
	publishedAt?: Date;

	@ApiProperty({
		description: 'The date when the catalogue expires',
		example: '2024-09-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@Prop({ type: Date })
	expiresAt?: Date;

	@ApiProperty({
		description: 'The tags associated with the catalogue',
		example: ['summer', 'clothing', 'accessories'],
		type: [String],
	})
	@Prop({ type: [{ type: String }] })
	tags: string[];

	@ApiProperty({
		description: 'The number of times the catalogue has been viewed',
		example: 150,
		type: Number,
	})
	@Prop({ type: Number, default: 0 })
	viewCount: number;

	@ApiProperty({
		description: 'The number of products in the catalogue',
		example: 25,
		type: Number,
	})
	@Prop({ type: Number, default: 0 })
	productCount: number;

	@ApiProperty({
		description: 'Whether the catalogue is featured',
		example: false,
		type: Boolean,
	})
	@Prop({ type: Boolean, default: false })
	isFeatured: boolean;

	@ApiProperty({
		description: 'The date when the catalogue was featured',
		example: '2024-03-20T10:00:00Z',
		required: false,
		type: Date,
	})
	@Prop({ type: Date })
	featuredAt?: Date;

	@ApiProperty({
		description: 'The average rating of the catalogue',
		example: 4.5,
		type: Number,
	})
	@Prop({ type: Number, default: 0 })
	rating: number;

	@ApiProperty({
		description: 'The number of reviews for the catalogue',
		example: 10,
		type: Number,
	})
	@Prop({ type: Number, default: 0 })
	reviewCount: number;
}

export type CatalogueDocument = HydratedDocument<Catalogue>;

export const CatalogueSchema = SchemaFactory.createForClass(Catalogue);
