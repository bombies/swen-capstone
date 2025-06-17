import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Merchant {
	@ApiProperty({
		description: 'The ID of the user associated with this merchant account',
		type: String,
	})
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	user: User;

	@ApiProperty({
		description: 'The name of the company',
		example: 'Acme Corporation',
	})
	@Prop({ required: true })
	companyName: string;

	@ApiProperty({
		description: 'The physical address of the company',
		example: '123 Main Street, Kingston, Jamaica',
	})
	@Prop({ required: true })
	companyAddress: string;

	@ApiProperty({
		description: 'The contact phone number of the company',
		example: '+1 (876) 555-0123',
	})
	@Prop({ required: true })
	companyPhone: string;

	@ApiProperty({
		description: 'Whether the merchant is compliant with regulations',
		default: false,
	})
	@Prop({ default: false })
	isCompliant: boolean;

	@ApiProperty({
		description: 'The date when the merchant verification expires',
		required: false,
	})
	@Prop()
	verificationExpiresAt?: Date;

	@ApiProperty({
		description: 'List of letters of good standing',
		type: [String],
	})
	@Prop({ type: [{ type: Types.ObjectId, ref: 'LetterOfGoodStanding' }] })
	lettersOfGoodStanding: Types.ObjectId[];

	@ApiProperty({
		description: 'The most recent letter of good standing',
		type: String,
		required: false,
	})
	@Prop({ type: Types.ObjectId, ref: 'LetterOfGoodStanding' })
	latestLetter?: Types.ObjectId;
}

export type MerchantDocument = HydratedDocument<Merchant>;

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
