import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Request() req, @Body('refreshToken') refreshToken: string) {
		await this.authService.logout(req.user._id.toString(), refreshToken);
		return { message: 'Logged out successfully' };
	}

	@Public()
	@Post('refresh')
	async refreshToken(
		@Body('userId') userId: string,
		@Body('refreshToken') refreshToken: string,
	) {
		return this.authService.refreshToken(userId, refreshToken);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
