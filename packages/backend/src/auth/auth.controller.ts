import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AddRoleDto } from './dto/add-role.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { SessionService } from './session.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionService,
	) {}

	@Post('login')
	@Public()
	@ApiOperation({ summary: 'User login' })
	@ApiResponse({
		status: 200,
		description: 'Login successful',
		schema: {
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
				user: { type: 'object' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Invalid credentials.' })
	async login(
		@Body() loginDto: LoginDto,
		@Request() req,
	) {
		const user = await this.authService.validateUser(
			loginDto.email,
			loginDto.password,
		);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const deviceInfo = {
			ip: req.ip,
			userAgent: req.headers['user-agent'],
		};

		return this.authService.login(user as UserDocument, deviceInfo);
	}

	@Post('refresh')
	@Public()
	@ApiOperation({ summary: 'Refresh access token' })
	@ApiResponse({
		status: 200,
		description: 'Token refresh successful',
		schema: {
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Invalid refresh token.' })
	async refreshToken(
		@Body() refreshTokenDto: RefreshTokenDto,
		@Request() req,
	) {
		const deviceInfo = {
			ip: req.ip,
			userAgent: req.headers['user-agent'],
		};

		return this.authService.refreshToken(
			req.user.sub,
			refreshTokenDto.refreshToken,
			deviceInfo,
		);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('logout')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Logout from current device' })
	@ApiResponse({
		status: 200,
		description: 'Logout successful',
		schema: {
			properties: {
				message: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async logout(@Body() logoutDto: LogoutDto) {
		await this.authService.logout(logoutDto.tokenId);
		return { message: 'Logged out successfully' };
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('logout-all')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Logout from all devices' })
	@ApiResponse({
		status: 200,
		description: 'Logout from all devices successful',
		schema: {
			properties: {
				message: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async logoutAll(@Request() req) {
		await this.authService.logoutAll(req.user.sub);
		return { message: 'Logged out from all devices' };
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('switch-role')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Switch user role' })
	@ApiResponse({
		status: 200,
		description: 'Role switch successful',
		schema: {
			properties: {
				accessToken: { type: 'string' },
				role: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async switchRole(
		@Request() req,
		@Body() switchRoleDto: SwitchRoleDto,
	) {
		const token = await this.sessionService.switchRole(
			req.user.sub,
			switchRoleDto.role,
			switchRoleDto.tokenId,
		);

		return {
			accessToken: token,
			role: switchRoleDto.role,
		};
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('sessions')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get active sessions' })
	@ApiResponse({
		status: 200,
		description: 'List of active sessions',
		schema: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					deviceInfo: { type: 'object' },
					lastActive: { type: 'string' },
				},
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async getActiveSessions(@Request() req) {
		return this.authService.getActiveSessions(req.user.sub);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get user profile' })
	@ApiResponse({
		status: 200,
		description: 'User profile information',
		schema: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				email: { type: 'string' },
				firstName: { type: 'string' },
				lastName: { type: 'string' },
				role: { type: 'string' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	getProfile(@Request() req) {
		return req.user;
	}

	@Post('register')
	@Public()
	@ApiOperation({ summary: 'Register a new user as customer or merchant' })
	@ApiResponse({
		status: 201,
		description: 'Registration successful',
		schema: {
			properties: {
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
				user: { type: 'object' },
			},
		},
	})
	@ApiResponse({ status: 409, description: 'User with this email already exists.' })
	async register(@Body() registerDto: RegisterDto, @Request() req) {
		const deviceInfo = {
			ip: req.ip,
			userAgent: req.headers['user-agent'],
		};
		return this.authService.register(registerDto, deviceInfo);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('add-role')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Add a new role (merchant/customer) to the current user' })
	@ApiResponse({
		status: 200,
		description: 'Role added successfully',
		schema: {
			properties: {
				message: { type: 'string' },
				roles: { type: 'array', items: { type: 'string' } },
			},
		},
	})
	@ApiResponse({ status: 409, description: 'User already has this role.' })
	async addRole(@CurrentUser('sub') userId: string, @Body() addRoleDto: AddRoleDto) {
		return this.authService.addRole(userId, addRoleDto);
	}
}
