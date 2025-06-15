import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutDto {
	@ApiProperty({
		description: 'Token ID to revoke',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	tokenId: string;
}
