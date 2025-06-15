import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, UserStatus } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('usersService', () => {
	let service: UsersService;
	let _model: Model<User>;

	const mockUser = {
		_id: 'mockUserId',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		password: 'hashedPassword',
		role: UserRole.CUSTOMER,
		status: UserStatus.ACTIVE,
		save: jest.fn(),
	};

	const mockModel = {
		new: jest.fn().mockResolvedValue(mockUser),
		constructor: jest.fn().mockResolvedValue(mockUser),
		find: jest.fn(),
		findById: jest.fn(),
		findOne: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		deleteOne: jest.fn(),
		exec: jest.fn(),
	};

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getModelToken(User.name),
					useValue: mockModel,
				},
			],
		}).compile();

		service = testingModule.get<UsersService>(UsersService);
		_model = testingModule.get<Model<User>>(getModelToken(User.name));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a new user with hashed password', async () => {
			const createUserDto: CreateUserDto = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				password: 'password123',
			};

			jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
			mockModel.new.mockReturnValue(mockUser);
			mockUser.save.mockResolvedValue(mockUser);

			const result = await service.create(createUserDto);

			expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
			expect(mockModel.new).toHaveBeenCalledWith({
				...createUserDto,
				password: 'hashedPassword',
			});
			expect(mockUser.save).toHaveBeenCalled();
			expect(result).toEqual(mockUser);
		});
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const mockUsers = [mockUser];
			mockModel.find.mockReturnValue({
				exec: jest.fn().mockResolvedValue(mockUsers),
			});

			const result = await service.findAll();

			expect(mockModel.find).toHaveBeenCalled();
			expect(result).toEqual(mockUsers);
		});
	});

	describe('findById', () => {
		it('should return a user by id', async () => {
			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(mockUser),
			});

			const result = await service.findById('mockUserId');

			expect(mockModel.findById).toHaveBeenCalledWith('mockUserId');
			expect(result).toEqual(mockUser);
		});

		it('should throw NotFoundException if user not found', async () => {
			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(null),
			});

			await expect(service.findById('nonexistentId')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('findByEmail', () => {
		it('should return a user by email', async () => {
			mockModel.findOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue(mockUser),
			});

			const result = await service.findByEmail('john@example.com');

			expect(mockModel.findOne).toHaveBeenCalledWith({
				email: 'john@example.com',
			});
			expect(result).toEqual(mockUser);
		});

		it('should return null if user not found', async () => {
			mockModel.findOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue(null),
			});

			const result = await service.findByEmail('nonexistent@example.com');

			expect(result).toBeNull();
		});
	});

	describe('update', () => {
		it('should update a user', async () => {
			const updateUserDto: UpdateUserDto = {
				firstName: 'Jane',
			};

			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue({ ...mockUser, ...updateUserDto }),
			});

			const result = await service.update('mockUserId', updateUserDto);

			expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'mockUserId',
				updateUserDto,
				{ new: true },
			);
			expect(result).toEqual({ ...mockUser, ...updateUserDto });
		});

		it('should hash password if included in update', async () => {
			const updateUserDto: UpdateUserDto = {
				password: 'newPassword',
			};

			jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as never);
			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue({
					...mockUser,
					password: 'newHashedPassword',
				}),
			});

			const result = await service.update('mockUserId', updateUserDto);

			expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
			expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'mockUserId',
				{ password: 'newHashedPassword' },
				{ new: true },
			);
			expect(result.password).toBe('newHashedPassword');
		});

		it('should throw NotFoundException if user not found', async () => {
			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue(null),
			});

			await expect(
				service.update('nonexistentId', { firstName: 'Jane' }),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe('remove', () => {
		it('should delete a user', async () => {
			mockModel.deleteOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
			});

			await service.remove('mockUserId');

			expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'mockUserId' });
		});

		it('should throw NotFoundException if user not found', async () => {
			mockModel.deleteOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
			});

			await expect(service.remove('nonexistentId')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('updateStatus', () => {
		it('should update user status', async () => {
			const updatedUser = {
				...mockUser,
				status: UserStatus.SUSPENDED,
				statusReason: 'Violation of terms',
			};

			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue(updatedUser),
			});

			const result = await service.updateStatus(
				'mockUserId',
				UserStatus.SUSPENDED,
				'Violation of terms',
			);

			expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'mockUserId',
				{
					status: UserStatus.SUSPENDED,
					statusReason: 'Violation of terms',
				},
				{ new: true },
			);
			expect(result).toEqual(updatedUser);
		});

		it('should throw NotFoundException if user not found', async () => {
			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue(null),
			});

			await expect(
				service.updateStatus('nonexistentId', UserStatus.SUSPENDED),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe('validateUser', () => {
		it('should return user if credentials are valid', async () => {
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
			jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);

			const result = await service.validateUser(
				'john@example.com',
				'password123',
			);

			expect(service.findByEmail).toHaveBeenCalledWith('john@example.com');
			expect(bcrypt.compare).toHaveBeenCalledWith(
				'password123',
				mockUser.password,
			);
			expect(result).toEqual(mockUser);
		});

		it('should return null if user not found', async () => {
			jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

			const result = await service.validateUser(
				'nonexistent@example.com',
				'password123',
			);

			expect(result).toBeNull();
		});

		it('should return null if password is invalid', async () => {
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
			jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);

			const result = await service.validateUser(
				'john@example.com',
				'wrongpassword',
			);

			expect(result).toBeNull();
		});
	});

	describe('refresh token management', () => {
		it('should add refresh token', async () => {
			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue(mockUser),
			});

			await service.addRefreshToken('mockUserId', 'newToken');

			expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'mockUserId',
				{ $push: { refreshTokens: 'newToken' } },
			);
		});

		it('should remove refresh token', async () => {
			mockModel.findByIdAndUpdate.mockReturnValue({
				exec: jest.fn().mockResolvedValue(mockUser),
			});

			await service.removeRefreshToken('mockUserId', 'oldToken');

			expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
				'mockUserId',
				{ $pull: { refreshTokens: 'oldToken' } },
			);
		});
	});

	describe('verification methods', () => {
		it('should verify email', async () => {
			const unverifiedUser = {
				...mockUser,
				isEmailVerified: false,
				emailVerificationToken: 'token',
			};

			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(unverifiedUser),
			});

			const result = await service.verifyEmail('mockUserId');

			expect(result.isEmailVerified).toBe(true);
			expect(result.emailVerificationToken).toBeUndefined();
		});

		it('should throw BadRequestException if email already verified', async () => {
			const verifiedUser = {
				...mockUser,
				isEmailVerified: true,
			};

			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(verifiedUser),
			});

			await expect(service.verifyEmail('mockUserId')).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should verify phone', async () => {
			const unverifiedUser = {
				...mockUser,
				isPhoneVerified: false,
				phoneVerificationToken: 'token',
			};

			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(unverifiedUser),
			});

			const result = await service.verifyPhone('mockUserId');

			expect(result.isPhoneVerified).toBe(true);
			expect(result.phoneVerificationToken).toBeUndefined();
		});

		it('should throw BadRequestException if phone already verified', async () => {
			const verifiedUser = {
				...mockUser,
				isPhoneVerified: true,
			};

			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(verifiedUser),
			});

			await expect(service.verifyPhone('mockUserId')).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('acceptTerms', () => {
		it('should accept terms and conditions', async () => {
			const userWithoutTerms = {
				...mockUser,
				hasAcceptedTerms: false,
			};

			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(userWithoutTerms),
			});

			const result = await service.acceptTerms(
				'mockUserId',
				'127.0.0.1',
				'Mozilla/5.0',
			);

			expect(result.hasAcceptedTerms).toBe(true);
			expect(result.termsAcceptedAt).toBeDefined();
			expect(result.termsAcceptedIp).toBe('127.0.0.1');
			expect(result.termsAcceptedUserAgent).toBe('Mozilla/5.0');
		});

		it('should throw BadRequestException if terms already accepted', async () => {
			const userWithTerms = {
				...mockUser,
				hasAcceptedTerms: true,
			};

			mockModel.findById.mockReturnValue({
				exec: jest.fn().mockResolvedValue(userWithTerms),
			});

			await expect(
				service.acceptTerms('mockUserId', '127.0.0.1', 'Mozilla/5.0'),
			).rejects.toThrow(BadRequestException);
		});
	});
});
