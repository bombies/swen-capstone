import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
	@ApiProperty({
		description: 'User first name',
		example: 'John',
	})
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({
		description: 'User last name',
		example: 'Doe',
	})
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({
		description: 'User email address',
		example: 'john.doe@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'User password (minimum 8 characters)',
		example: 'password123',
		minLength: 8,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@ApiProperty({
		description: 'User phone number',
		example: '+1234567890',
		required: false,
	})
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({
		description: 'User address',
		example: '123 Main St, City, Country',
		required: false,
	})
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({
		description: 'User roles',
		enum: UserRole,
		example: [UserRole.CUSTOMER],
		default: [UserRole.CUSTOMER],
	})
	@IsArray()
	@IsEnum(UserRole, { each: true })
	@IsOptional()
	roles?: UserRole[];

	@ApiProperty({
		description: 'Active user role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
		default: UserRole.CUSTOMER,
	})
	@IsEnum(UserRole)
	@IsOptional()
	activeRole?: UserRole;

	@ApiProperty({
		description: 'Whether user has accepted terms and privacy policy',
		example: true,
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	acceptedTermsAndPrivacy?: boolean;

	@ApiProperty({
		description: 'Date when policies were accepted',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@IsDate()
	@IsOptional()
	policiesAcceptedAt?: Date;
}
