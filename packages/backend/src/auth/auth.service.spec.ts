import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('authService', () => {
	let service: AuthService;
	let usersService: UsersService;

	const mockUser: User = {
		_id: new Types.ObjectId(),
		email: 'test@example.com',
		username: 'testuser',
		firstName: 'Test',
		lastName: 'User',
		password: 'hashedPassword',
		refreshTokens: [],
		isEmailVerified: false,
		lastLoginAt: new Date(),
		acceptedTermsAndPrivacy: false,
		eSignature: '',
		policiesAcceptedAt: new Date(),
		termsAndPrivacyAcceptedAt: new Date(),
		banned: false,
		bannedAt: new Date(),
		bannedReason: '',
	};

	const mockUsersService = {
		validateUser: jest.fn(),
		findById: jest.fn(),
		addRefreshToken: jest.fn(),
		removeRefreshToken: jest.fn(),
		updateLastLogin: jest.fn(),
	};

	const mockJwtService = {
		signAsync: jest.fn(),
	};

	const mockConfigService = {
		get: jest.fn(),
	};

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		service = testingModule.get<AuthService>(AuthService);
		usersService = testingModule.get<UsersService>(UsersService);

		// Reset all mocks before each test
		jest.clearAllMocks();
	});

	describe('validateUser', () => {
		it('should return user when credentials are valid', async () => {
			mockUsersService.validateUser.mockResolvedValue(mockUser);

			const result = await service.validateUser('test@example.com', 'password');
			expect(result).toEqual(mockUser);
			expect(usersService.validateUser).toHaveBeenCalledWith('test@example.com', 'password');
		});

		it('should throw UnauthorizedException when credentials are invalid', async () => {
			mockUsersService.validateUser.mockResolvedValue(null);

			await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe('login', () => {
		const mockTokens = {
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		};

		beforeEach(() => {
			mockJwtService.signAsync.mockImplementation((payload, options) => {
				return Promise.resolve(
					options.expiresIn === '15m' ? mockTokens.accessToken : mockTokens.refreshToken,
				);
			});
		});

		it('should return tokens and user data on successful login', async () => {
			const result = await service.login(mockUser);

			expect(result).toEqual({
				accessToken: mockTokens.accessToken,
				refreshToken: mockTokens.refreshToken,
				user: {
					id: mockUser._id,
					email: mockUser.email,
					firstName: mockUser.firstName,
					lastName: mockUser.lastName,
				},
			});

			expect(usersService.addRefreshToken).toHaveBeenCalledWith(
				mockUser._id.toString(),
				mockTokens.refreshToken,
			);
			expect(usersService.updateLastLogin).toHaveBeenCalledWith(mockUser._id.toString());
		});
	});

	describe('refreshToken', () => {
		const mockTokens = {
			accessToken: 'new-access-token',
			refreshToken: 'new-refresh-token',
		};

		beforeEach(() => {
			mockJwtService.signAsync.mockImplementation((payload, options) => {
				return Promise.resolve(
					options.expiresIn === '15m' ? mockTokens.accessToken : mockTokens.refreshToken,
				);
			});
		});

		it('should return new tokens when refresh token is valid', async () => {
			const userId = mockUser._id.toString();
			const refreshToken = 'valid-refresh-token';
			mockUsersService.findById.mockResolvedValue({
				...mockUser,
				refreshTokens: [refreshToken],
			});

			const result = await service.refreshToken(userId, refreshToken);

			expect(result).toEqual({
				accessToken: mockTokens.accessToken,
				refreshToken: mockTokens.refreshToken,
			});

			expect(usersService.removeRefreshToken).toHaveBeenCalledWith(userId, refreshToken);
			expect(usersService.addRefreshToken).toHaveBeenCalledWith(userId, mockTokens.refreshToken);
		});

		it('should throw UnauthorizedException when refresh token is invalid', async () => {
			const userId = mockUser._id.toString();
			const refreshToken = 'invalid-refresh-token';
			mockUsersService.findById.mockResolvedValue({
				...mockUser,
				refreshTokens: ['different-token'],
			});

			await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw UnauthorizedException when user is not found', async () => {
			const userId = mockUser._id.toString();
			const refreshToken = 'valid-refresh-token';
			mockUsersService.findById.mockResolvedValue(null);

			await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe('logout', () => {
		it('should remove refresh token on logout', async () => {
			const userId = mockUser._id.toString();
			const refreshToken = 'refresh-token';

			await service.logout(userId, refreshToken);

			expect(usersService.removeRefreshToken).toHaveBeenCalledWith(userId, refreshToken);
		});
	});
});
