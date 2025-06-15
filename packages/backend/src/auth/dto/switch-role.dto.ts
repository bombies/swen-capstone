import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class SwitchRoleDto {
	@ApiProperty({
		description: 'Role to switch to',
		enum: UserRole,
		example: UserRole.CUSTOMER,
	})
	@IsEnum(UserRole)
	role: UserRole;
}
