import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
	@ApiProperty({
		description: 'User ID who wrote the review',
		example: '507f1f77bcf86cd799439011',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	user: Types.ObjectId;

	@ApiProperty({
		description: 'Product ID being reviewed',
		example: '507f1f77bcf86cd799439012',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
	product: Types.ObjectId;

	@ApiProperty({
		description: 'Merchant ID of the product',
		example: '507f1f77bcf86cd799439013',
	})
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
	merchant: Types.ObjectId;

	@ApiProperty({
		description: 'Rating from 1 to 5',
		example: 4,
		minimum: 1,
		maximum: 5,
	})
	@Prop({ required: true, min: 1, max: 5 })
	rating: number;

	@ApiProperty({
		description: 'Review content',
		example: 'Great product, very satisfied with the quality!',
	})
	@Prop({ required: true })
	content: string;

	@ApiProperty({
		description: 'Array of image URLs',
		example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
		type: [String],
		default: [],
	})
	@Prop({ type: [String], default: [] })
	images: string[];

	@ApiProperty({
		description: 'Array of user IDs who found this review helpful',
		example: ['507f1f77bcf86cd799439014', '507f1f77bcf86cd799439015'],
		type: [String],
		default: [],
	})
	@Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
	helpfulUsers: Types.ObjectId[];

	@ApiProperty({
		description: 'Number of users who found this review helpful',
		example: 5,
		default: 0,
	})
	@Prop({ default: 0 })
	helpfulCount: number;

	@ApiProperty({
		description: 'Whether the review has been edited',
		example: false,
		default: false,
	})
	@Prop({ default: false })
	isEdited: boolean;

	@ApiProperty({
		description: 'Date when the review was last edited',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@Prop()
	editedAt?: Date;
}

export type ReviewDocument = HydratedDocument<Review>;

export const ReviewSchema = SchemaFactory.createForClass(Review);
