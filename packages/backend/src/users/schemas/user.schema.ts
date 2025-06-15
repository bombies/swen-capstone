import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
	ADMIN = 'admin',
	MERCHANT = 'merchant',
	CUSTOMER = 'customer',
}

export enum UserStatus {
	PENDING = 'pending',
	ACTIVE = 'active',
	SUSPENDED = 'suspended',
	DELETED = 'deleted',
}

@Schema({ timestamps: true })
export class User {
	@ApiProperty({
		description: 'Username',
		example: 'johndoe',
	})
	@Prop({ required: true, unique: true })
	username: string;

	@ApiProperty({
		description: 'Email address',
		example: 'john.doe@example.com',
	})
	@Prop({ required: true, unique: true })
	email: string;

	@ApiProperty({
		description: 'Hashed password',
		example: '$2b$10$abcdefghijklmnopqrstuvwxyz',
	})
	@Prop({ required: true })
	passwordHash: string;

	@ApiProperty({
		description: 'First name',
		example: 'John',
	})
	@Prop({ required: true })
	firstName: string;

	@ApiProperty({
		description: 'Last name',
		example: 'Doe',
	})
	@Prop({ required: true })
	lastName: string;

	@ApiProperty({
		description: 'Whether user has accepted terms and privacy policy',
		example: true,
		default: false,
	})
	@Prop({ required: true, default: false })
	acceptedTermsAndPrivacy: boolean;

	@ApiProperty({
		description: 'Electronic signature',
		example: 'John Doe',
	})
	@Prop({ required: true })
	eSignature: string;

	@ApiProperty({
		description: 'Date when policies were accepted',
		example: '2024-03-15T00:00:00.000Z',
	})
	@Prop({ required: true })
	policiesAcceptedAt: Date;

	@ApiProperty({
		description: 'Whether user is banned',
		example: false,
		default: false,
	})
	@Prop({ required: true, default: false })
	banned: boolean;

	@ApiProperty({
		description: 'Date until which user is banned',
		example: '2024-04-15T00:00:00.000Z',
		required: false,
	})
	@Prop()
	bannedUntil?: Date;

	@ApiProperty({
		description: 'Reason for ban',
		example: 'Violation of terms of service',
		required: false,
	})
	@Prop()
	bannedReason?: string;

	@ApiProperty({
		description: 'User roles',
		enum: UserRole,
		example: [UserRole.CUSTOMER],
		default: [UserRole.CUSTOMER],
	})
	@Prop({ type: [String], enum: UserRole, default: [UserRole.CUSTOMER] })
	roles: UserRole[];

	@ApiProperty({
		description: 'Active user role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
		default: UserRole.CUSTOMER,
	})
	@Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
	activeRole: UserRole;

	@ApiProperty({
		description: 'User status',
		enum: UserStatus,
		example: UserStatus.PENDING,
		default: UserStatus.PENDING,
	})
	@Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
	status: UserStatus;

	@ApiProperty({
		description: 'Phone number',
		example: '+1234567890',
		required: false,
	})
	@Prop()
	phone?: string;

	@ApiProperty({
		description: 'Address',
		example: '123 Main St, City, Country',
		required: false,
	})
	@Prop()
	address?: string;

	@ApiProperty({
		description: 'Profile picture URL',
		example: 'https://example.com/profile.jpg',
		required: false,
	})
	@Prop()
	profilePicture?: string;

	@ApiProperty({
		description: 'Whether email is verified',
		example: false,
		default: false,
	})
	@Prop({ default: false })
	isEmailVerified: boolean;

	@ApiProperty({
		description: 'Whether phone is verified',
		example: false,
		default: false,
	})
	@Prop({ default: false })
	isPhoneVerified: boolean;

	@ApiProperty({
		description: 'Whether terms have been accepted',
		example: false,
		default: false,
	})
	@Prop({ default: false })
	hasAcceptedTerms: boolean;

	@ApiProperty({
		description: 'Date when terms were accepted',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@Prop()
	termsAcceptedAt?: Date;

	@ApiProperty({
		description: 'IP address when terms were accepted',
		example: '192.168.1.1',
		required: false,
	})
	@Prop()
	termsAcceptedIp?: string;

	@ApiProperty({
		description: 'User agent when terms were accepted',
		example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
		required: false,
	})
	@Prop()
	termsAcceptedUserAgent?: string;

	@ApiProperty({
		description: 'Last login date',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@Prop()
	lastLoginAt?: Date;

	@ApiProperty({
		description: 'Last login IP address',
		example: '192.168.1.1',
		required: false,
	})
	@Prop()
	lastLoginIp?: string;

	@ApiProperty({
		description: 'Last login user agent',
		example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
		required: false,
	})
	@Prop()
	lastLoginUserAgent?: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
