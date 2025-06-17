import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class SwitchRoleDto {
	@ApiProperty({
		description: 'Role to switch to',
		enum: UserRole,
		example: UserRole.CUSTOMER,
	})
	@IsEnum(UserRole)
	role: UserRole;

	@ApiProperty({
		description: 'Token ID',
		example: '0x1234567890',
	})
	@IsString()
	tokenId: string;
}
