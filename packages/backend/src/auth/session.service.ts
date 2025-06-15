import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';

export class SessionPayload {
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

	@ApiProperty({
		description: 'Token issued at timestamp',
		example: 1710432000000,
		required: false,
	})
	iat?: number;

	@ApiProperty({
		description: 'Token expiration timestamp',
		example: 1710518400000,
		required: false,
	})
	exp?: number;
}

@Injectable()
export class SessionService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async createSession(user: UserDocument, role: UserRole): Promise<string> {
		if (!user.roles.includes(role)) {
			throw new UnauthorizedException('User does not have this role');
		}

		const payload: SessionPayload = {
			sub: user._id.toString(),
			email: user.email,
			role,
		};

		return this.jwtService.signAsync(payload);
	}

	async switchRole(userId: string, newRole: UserRole): Promise<string> {
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		if (!user.roles.includes(newRole)) {
			throw new UnauthorizedException('User does not have this role');
		}

		// Update active role
		user.activeRole = newRole;
		await user.save();

		// Create new session with new role
		return this.createSession(user, newRole);
	}

	async validateSession(token: string): Promise<SessionPayload> {
		try {
			const payload = await this.jwtService.verifyAsync<SessionPayload>(token);
			const user = await this.userModel.findById(payload.sub);

			if (!user || !user.roles.includes(payload.role)) {
				throw new UnauthorizedException('Invalid session');
			}

			return payload;
		} catch {
			throw new UnauthorizedException('Invalid session');
		}
	}

	async getActiveSessions(userId: string): Promise<{ role: UserRole; token: string }[]> {
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		return Promise.all(
			user.roles.map(async role => ({
				role,
				token: await this.createSession(user, role),
			})),
		);
	}
}
