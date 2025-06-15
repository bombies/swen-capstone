import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, UserStatus } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('usersController', () => {
	let controller: UsersController;
	let service: UsersService;

	const mockUser = {
		_id: 'mockUserId',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		role: UserRole.CUSTOMER,
		status: UserStatus.ACTIVE,
	};

	const mockUsersService = {
		create: jest.fn(),
		findAll: jest.fn(),
		findById: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
		updateStatus: jest.fn(),
		verifyEmail: jest.fn(),
		verifyPhone: jest.fn(),
		acceptTerms: jest.fn(),
	};

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue({ canActivate: () => true })
			.overrideGuard(RolesGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = testingModule.get<UsersController>(UsersController);
		service = testingModule.get<UsersService>(UsersService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('create', () => {
		it('should create a new user', async () => {
			const createUserDto: CreateUserDto = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
				password: 'password123',
			};

			mockUsersService.create.mockResolvedValue(mockUser);

			const result = await controller.create(createUserDto);

			expect(service.create).toHaveBeenCalledWith(createUserDto);
			expect(result).toEqual(mockUser);
		});
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const mockUsers = [mockUser];
			mockUsersService.findAll.mockResolvedValue(mockUsers);

			const result = await controller.findAll();

			expect(service.findAll).toHaveBeenCalled();
			expect(result).toEqual(mockUsers);
		});
	});

	describe('findOne', () => {
		it('should return a user by id', async () => {
			mockUsersService.findById.mockResolvedValue(mockUser);

			const result = await controller.findOne('mockUserId');

			expect(service.findById).toHaveBeenCalledWith('mockUserId');
			expect(result).toEqual(mockUser);
		});
	});

	describe('getProfile', () => {
		it('should return the current user profile', async () => {
			mockUsersService.findById.mockResolvedValue(mockUser);

			const result = await controller.getProfile('mockUserId');

			expect(service.findById).toHaveBeenCalledWith('mockUserId');
			expect(result).toEqual(mockUser);
		});
	});

	describe('updateProfile', () => {
		it('should update the current user profile', async () => {
			const updateUserDto: UpdateUserDto = {
				firstName: 'Jane',
			};

			mockUsersService.update.mockResolvedValue({
				...mockUser,
				...updateUserDto,
			});

			const result = await controller.updateProfile(
				'mockUserId',
				updateUserDto,
			);

			expect(service.update).toHaveBeenCalledWith(
				'mockUserId',
				updateUserDto,
			);
			expect(result).toEqual({ ...mockUser, ...updateUserDto });
		});
	});

	describe('update', () => {
		it('should update a user', async () => {
			const updateUserDto: UpdateUserDto = {
				firstName: 'Jane',
			};

			mockUsersService.update.mockResolvedValue({
				...mockUser,
				...updateUserDto,
			});

			const result = await controller.update('mockUserId', updateUserDto);

			expect(service.update).toHaveBeenCalledWith(
				'mockUserId',
				updateUserDto,
			);
			expect(result).toEqual({ ...mockUser, ...updateUserDto });
		});
	});

	describe('remove', () => {
		it('should delete a user', async () => {
			mockUsersService.remove.mockResolvedValue(undefined);

			await controller.remove('mockUserId');

			expect(service.remove).toHaveBeenCalledWith('mockUserId');
		});
	});

	describe('updateStatus', () => {
		it('should update user status', async () => {
			const updatedUser = {
				...mockUser,
				status: UserStatus.SUSPENDED,
			};

			mockUsersService.updateStatus.mockResolvedValue(updatedUser);

			const result = await controller.updateStatus(
				'mockUserId',
				UserStatus.SUSPENDED,
				'Violation of terms',
			);

			expect(service.updateStatus).toHaveBeenCalledWith(
				'mockUserId',
				UserStatus.SUSPENDED,
				'Violation of terms',
			);
			expect(result).toEqual(updatedUser);
		});
	});

	describe('verifyEmail', () => {
		it('should verify user email', async () => {
			const verifiedUser = {
				...mockUser,
				isEmailVerified: true,
			};

			mockUsersService.verifyEmail.mockResolvedValue(verifiedUser);

			const result = await controller.verifyEmail('mockUserId');

			expect(service.verifyEmail).toHaveBeenCalledWith('mockUserId');
			expect(result).toEqual(verifiedUser);
		});
	});

	describe('verifyPhone', () => {
		it('should verify user phone', async () => {
			const verifiedUser = {
				...mockUser,
				isPhoneVerified: true,
			};

			mockUsersService.verifyPhone.mockResolvedValue(verifiedUser);

			const result = await controller.verifyPhone('mockUserId');

			expect(service.verifyPhone).toHaveBeenCalledWith('mockUserId');
			expect(result).toEqual(verifiedUser);
		});
	});

	describe('acceptTerms', () => {
		it('should accept terms and conditions', async () => {
			const userWithTerms = {
				...mockUser,
				hasAcceptedTerms: true,
				termsAcceptedAt: new Date(),
				termsAcceptedIp: '127.0.0.1',
				termsAcceptedUserAgent: 'Mozilla/5.0',
			};

			mockUsersService.acceptTerms.mockResolvedValue(userWithTerms);

			const mockReq = {
				ip: '127.0.0.1',
				headers: {
					'user-agent': 'Mozilla/5.0',
				},
			};

			const result = await controller.acceptTerms('mockUserId', mockReq);

			expect(service.acceptTerms).toHaveBeenCalledWith(
				'mockUserId',
				'127.0.0.1',
				'Mozilla/5.0',
			);
			expect(result).toEqual(userWithTerms);
		});
	});
});
