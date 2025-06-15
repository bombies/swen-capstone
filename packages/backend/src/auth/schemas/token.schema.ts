import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { UserRole } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Token {
	@ApiProperty({
		description: 'User ID',
		example: '507f1f77bcf86cd799439011',
	})
	@Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
	userId: Types.ObjectId;

	@ApiProperty({
		description: 'Refresh token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@Prop({ required: true })
	refreshToken: string;

	@ApiProperty({
		description: 'Access token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@Prop({ required: true })
	accessToken: string;

	@ApiProperty({
		description: 'User role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
	})
	@Prop({ required: true, type: String, enum: UserRole })
	role: UserRole;

	@ApiProperty({
		description: 'Token expiration date',
		example: '2024-03-22T00:00:00.000Z',
	})
	@Prop({ required: true })
	expiresAt: Date;

	@ApiProperty({
		description: 'Whether token is revoked',
		example: false,
		default: false,
	})
	@Prop({ default: false })
	isRevoked: boolean;

	@ApiProperty({
		description: 'Device information',
		example: {
			ip: '192.168.1.1',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			lastUsed: '2024-03-15T00:00:00.000Z',
		},
		required: false,
	})
	@Prop(raw({
		ip: { type: String, required: true },
		userAgent: { type: String, required: true },
		lastUsed: { type: Date, default: Date.now },
	}))
	deviceInfo?: {
		ip: string;
		userAgent: string;
		lastUsed: Date;
	};

	@ApiProperty({
		description: 'Token creation date',
		example: '2024-03-15T00:00:00.000Z',
	})
	@Prop({ default: Date.now })
	createdAt: Date;

	@ApiProperty({
		description: 'Last used date',
		example: '2024-03-15T00:00:00.000Z',
	})
	@Prop({ default: Date.now })
	lastUsedAt: Date;
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);

// Add indexes for faster queries
TokenSchema.index({ userId: 1, role: 1 });
TokenSchema.index({ refreshToken: 1 }, { unique: true });
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
