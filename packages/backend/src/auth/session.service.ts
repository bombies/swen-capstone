import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Token, TokenDocument } from 'src/auth/schemas/token.schema';
import { JwtPayload } from 'src/auth/strategies/jwt.strategy';
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
		@InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
		private readonly jwtService: JwtService,
	) {}

	async createSession(user: UserDocument, role: UserRole, tokenId: string): Promise<string> {
		if (!user.roles.includes(role)) {
			throw new UnauthorizedException('User does not have this role');
		}

		const payload: SessionPayload = {
			sub: user._id.toString(),
			email: user.email,
			role,
		};

		const accessToken = await this.jwtService.signAsync(payload);

		await this.tokenModel.findByIdAndUpdate(tokenId, {
			accessToken,
			lastUsedAt: new Date(),
		});

		return accessToken;
	}

	async switchRole(userId: string, newRole: UserRole, tokenId: string): Promise<string> {
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
		return this.createSession(user, newRole, tokenId);
	}

	async validateSession(token: JwtPayload): Promise<SessionPayload> {
		const payload = token as SessionPayload;
		const user = await this.userModel.findById(payload.sub);

		if (!user || !user.roles.includes(payload.role)) {
			throw new UnauthorizedException(`Invalid session. Payload: ${JSON.stringify(payload, null, 4)}`);
		}

		return payload;
	}

	async getActiveSessions(userId: string): Promise<Token[]> {
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		const sessions = await this.tokenModel.find({
			userId,
		}).exec();

		return sessions as Token[];
	}
}
