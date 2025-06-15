import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AddRoleDto } from './dto/add-role.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService,
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.validateUser(email, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return user;
	}

	async register(registerDto: RegisterDto, deviceInfo?: { ip: string; userAgent: string }) {
		// Check if user already exists
		let existingUser = await this.usersService.findByEmail(registerDto.email);
		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		} else {
			existingUser = await this.usersService.findByUsername(registerDto.username);
			if (existingUser) {
				throw new ConflictException('User with this username already exists');
			}
		}

		// Create new user
		const user = (await this.usersService.create({
			...registerDto,
			acceptedTermsAndPrivacy: true,
			policiesAcceptedAt: new Date(),
		})) as UserDocument;

		// Generate tokens
		const tokens = await this.tokenService.createTokens(
			user.id,
			user.email,
			user.activeRole,
			deviceInfo,
		);

		return {
			...tokens,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				roles: user.roles,
				activeRole: user.activeRole,
			},
		};
	}

	async addRole(userId: string, addRoleDto: AddRoleDto) {
		const user = await this.usersService.findById(userId);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		// Check if user already has this role
		if (user.roles.includes(addRoleDto.role)) {
			throw new ConflictException('User already has this role');
		}

		// Add new role
		user.roles.push(addRoleDto.role);
		await this.usersService.update(userId, { roles: user.roles });

		return {
			message: `Role ${addRoleDto.role} added successfully`,
			roles: user.roles,
		};
	}

	async login(
		user: UserDocument,
		deviceInfo?: { ip: string; userAgent: string },
	) {
		const tokens = await this.tokenService.createTokens(
			user.id,
			user.email,
			user.activeRole,
			deviceInfo,
		);

		await this.usersService.updateLastLogin(user.id);

		return {
			...tokens,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				roles: user.roles,
				activeRole: user.activeRole,
			},
		};
	}

	async refreshToken(
		userId: string,
		refreshToken: string,
		deviceInfo?: { ip: string; userAgent: string },
	) {
		return this.tokenService.refreshTokens(userId, refreshToken, deviceInfo);
	}

	async logout(tokenId: string) {
		await this.tokenService.revokeToken(tokenId);
	}

	async logoutAll(userId: string) {
		await this.tokenService.revokeAllUserTokens(userId);
	}

	async getActiveSessions(userId: string) {
		return this.tokenService.getActiveTokens(userId);
	}
}
