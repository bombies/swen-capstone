import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class RegisterDto {
	@ApiProperty({
		description: 'Username',
		example: 'johndoe',
	})
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({
		description: 'Email address',
		example: 'john.doe@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'Password (minimum 8 characters)',
		example: 'password123',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@ApiProperty({
		description: 'First name',
		example: 'John',
	})
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@ApiProperty({
		description: 'Last name',
		example: 'Doe',
	})
	@IsString()
	@IsNotEmpty()
	lastName: string;

	@ApiProperty({
		description: 'Electronic signature',
		example: 'John Doe',
	})
	@IsString()
	@IsNotEmpty()
	eSignature: string;

	@ApiProperty({
		description: 'Phone number',
		example: '+1234567890',
		required: false,
	})
	@IsString()
	@IsOptional()
	phone?: string;

	@ApiProperty({
		description: 'Address',
		example: '123 Main St, City, Country',
		required: false,
	})
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty({
		description: 'Initial user role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
		default: UserRole.CUSTOMER,
	})
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}
