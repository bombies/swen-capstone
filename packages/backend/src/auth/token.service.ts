import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '../users/schemas/user.schema';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
	constructor(
		@InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async createTokens(
		userId: string,
		email: string,
		role: UserRole,
		deviceInfo?: { ip: string; userAgent: string },
	) {
		const payload = { sub: userId, email, role };
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour from now

		const token = await this.tokenModel.create({
			userId,
			accessToken,
			refreshToken,
			role,
			expiresAt,
			deviceInfo: deviceInfo
				? {
						ip: deviceInfo.ip,
						userAgent: deviceInfo.userAgent,
						lastUsed: new Date(),
					}
				: undefined,
		});

		return {
			accessToken,
			refreshToken,
			tokenId: token._id,
		};
	}

	async refreshTokens(
		userId: string,
		refreshToken: string,
		deviceInfo?: { ip: string; userAgent: string },
	) {
		const token = await this.tokenModel.findOne({
			userId,
			refreshToken,
			isRevoked: false,
		});

		if (!token) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		if (token.expiresAt < new Date()) {
			throw new UnauthorizedException('Refresh token has expired');
		}

		// Generate new tokens
		const payload = { sub: userId, role: token.role };
		const [newAccessToken, newRefreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		// Update token
		token.accessToken = newAccessToken;
		token.refreshToken = newRefreshToken;
		token.expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
		if (deviceInfo) {
			token.deviceInfo = {
				ip: deviceInfo.ip,
				userAgent: deviceInfo.userAgent,
				lastUsed: new Date(),
			};
		}
		token.lastUsedAt = new Date();
		await token.save();

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			tokenId: token.id,
		};
	}

	async revokeToken(tokenId: string) {
		const token = await this.tokenModel.findById(tokenId);
		if (token) {
			token.isRevoked = true;
			await token.save();
		}
	}

	async revokeAllUserTokens(userId: string) {
		await this.tokenModel.updateMany(
			{ userId, isRevoked: false },
			{ isRevoked: true },
		);
	}

	async getActiveTokens(userId: string) {
		return this.tokenModel.find({
			userId,
			isRevoked: false,
			expiresAt: { $gt: new Date() },
		});
	}

	private async generateAccessToken(payload: {
		sub: string;
		role: UserRole;
	}) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			expiresIn: '1h',
		});
	}

	private async generateRefreshToken(payload: {
		sub: string;
		role: UserRole;
	}) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			expiresIn: '30d',
		});
	}
}
