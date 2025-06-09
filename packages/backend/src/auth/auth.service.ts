import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.validateUser(email, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return user;
	}

	async login(user: User) {
		const payload = { sub: user._id.toString(), email: user.email };
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		await this.usersService.addRefreshToken(user._id.toString(), refreshToken);
		await this.usersService.updateLastLogin(user._id.toString());

		return {
			accessToken,
			refreshToken,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		};
	}

	async refreshToken(userId: string, refreshToken: string) {
		const user = await this.usersService.findById(userId);
		if (!user?.refreshTokens.includes(refreshToken)) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const payload = { sub: user._id.toString(), email: user.email };
		const [newAccessToken, newRefreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		]);

		await this.usersService.removeRefreshToken(userId, refreshToken);
		await this.usersService.addRefreshToken(userId, newRefreshToken);

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
	}

	async logout(userId: string, refreshToken: string) {
		await this.usersService.removeRefreshToken(userId, refreshToken);
	}

	private async generateAccessToken(payload: { sub: string; email: string }) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			expiresIn: '15m',
		});
	}

	private async generateRefreshToken(payload: { sub: string; email: string }) {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			expiresIn: '7d',
		});
	}
}
