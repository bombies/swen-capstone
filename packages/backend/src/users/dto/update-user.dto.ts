import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';
import { UserRole, UserStatus } from '../schemas/user.schema';

export class UpdateUserDto {
	@ApiProperty({
		description: 'User first name',
		example: 'John',
		required: false,
	})
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiProperty({
		description: 'User last name',
		example: 'Doe',
		required: false,
	})
	@IsString()
	@IsOptional()
	lastName?: string;

	@ApiProperty({
		description: 'User email address',
		example: 'john.doe@example.com',
		required: false,
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty({
		description: 'User password (minimum 8 characters)',
		example: 'password123',
		minLength: 8,
		required: false,
	})
	@IsString()
	@IsOptional()
	@MinLength(8)
	password?: string;

	@ApiProperty({
		description: 'User role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
		required: false,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole;

	@ApiProperty({
		description: 'User roles',
		enum: UserRole,
		example: [UserRole.CUSTOMER],
		required: false,
	})
	@IsArray()
	@IsEnum(UserRole, { each: true })
	@IsOptional()
	roles?: UserRole[];

	@ApiProperty({
		description: 'Active user role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
		required: false,
	})
	@IsEnum(UserRole)
	@IsOptional()
	activeRole?: UserRole;

	@ApiProperty({
		description: 'User status',
		enum: UserStatus,
		example: UserStatus.ACTIVE,
		required: false,
	})
	@IsEnum(UserStatus)
	@IsOptional()
	status?: UserStatus;

	@ApiProperty({
		description: 'User phone number',
		example: '+1234567890',
		required: false,
	})
	@IsString()
	@IsOptional()
	phone?: string;

	@ApiProperty({
		description: 'User address',
		example: '123 Main St, City, Country',
		required: false,
	})
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty({
		description: 'User profile picture URL',
		example: 'https://example.com/profile.jpg',
		required: false,
	})
	@IsString()
	@IsOptional()
	profilePicture?: string;
}
