import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ApiProperty } from '@nestjs/swagger';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../users/schemas/user.schema';
import { SessionService } from '../session.service';

export class JwtPayload {
	@ApiProperty({
		description: 'User ID',
		example: '507f1f77bcf86cd799439011',
	})
	sub: string;

	@ApiProperty({
		description: 'User email',
		example: 'john.doe@example.com',
	})
	email: string;

	@ApiProperty({
		description: 'User role',
		enum: UserRole,
		example: UserRole.CUSTOMER,
	})
	role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly sessionService: SessionService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
		});
	}

	async validate(payload: JwtPayload) {
		try {
			// Validate the session and ensure the role is still valid
			await this.sessionService.validateSession(payload.sub);
			return payload;
		} catch {
			throw new UnauthorizedException('Invalid session');
		}
	}
}
