import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class AddRoleDto {
	@ApiProperty({
		description: 'Role to add to the user',
		enum: UserRole,
		example: UserRole.MERCHANT,
	})
	@IsEnum(UserRole)
	@IsNotEmpty()
	role: UserRole;
}
