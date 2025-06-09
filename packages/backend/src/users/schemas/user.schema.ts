import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	_id: Types.ObjectId;

	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ default: false })
	isEmailVerified: boolean;

	@Prop({ type: [String], default: [] })
	refreshTokens: string[];

	@Prop({ type: Date, default: null })
	lastLoginAt: Date;

	@Prop({ type: Boolean, default: false })
	acceptedTermsAndPrivacy: boolean;

	@Prop({ type: String, default: null })
	eSignature: string;

	@Prop({ type: Date, default: null })
	policiesAcceptedAt: Date;

	@Prop({ type: Date, default: null })
	termsAndPrivacyAcceptedAt: Date;

	@Prop({ type: Boolean, default: false })
	banned: boolean;

	@Prop({ type: Date, default: null })
	bannedAt: Date;

	@Prop({ type: String, default: null })
	bannedReason: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
