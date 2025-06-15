import type {
	LoginDto,
	LoginResponse,
	LogoutDto,
	LogoutResponse,
	RefreshTokenDto,
	RefreshTokenResponse,
	RegisterDto,
	RegisterResponse,
	Session,
	SwitchRoleDto,
	SwitchRoleResponse,
	UserProfile,
} from '../types/auth.types';
import type {
	UserRole,
} from '../types/auth.types';
import { clearTokens, setAccessToken, setTokens } from '@/lib/auth';
import { ApiClient } from '../api-client';

export class AuthService {
	static async login(data: LoginDto): Promise<LoginResponse> {
		const response = await ApiClient.post<LoginResponse>('/auth/login', data, false);
		console.log(response);
		return response;
	}

	static async refreshToken(data: RefreshTokenDto): Promise<RefreshTokenResponse> {
		const response = await ApiClient.post<RefreshTokenResponse>('/auth/refresh', data, false);
		setTokens({
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		});
		return response;
	}

	static async logout(data: LogoutDto): Promise<LogoutResponse> {
		const response = await ApiClient.post<LogoutResponse>('/auth/logout', data);
		return response;
	}

	static async logoutAll(): Promise<LogoutResponse> {
		const response = await ApiClient.post<LogoutResponse>('/auth/logout-all', {});
		clearTokens();
		return response;
	}

	static async switchRole(data: SwitchRoleDto): Promise<SwitchRoleResponse> {
		const response = await ApiClient.post<SwitchRoleResponse>('/auth/switch-role', data);
		setAccessToken(response.accessToken);
		return response;
	}

	static async getProfile(): Promise<UserProfile> {
		return ApiClient.get<UserProfile>('/auth/profile');
	}

	static async getActiveSessions(): Promise<Session[]> {
		return ApiClient.get<Session[]>('/auth/sessions');
	}

	static isAuthenticated(): boolean {
		return !!localStorage.getItem('access_token');
	}

	static getAccessToken(): string | null {
		return localStorage.getItem('access_token');
	}

	static getRefreshToken(): string | null {
		return localStorage.getItem('refresh_token');
	}

	static async register(data: RegisterDto): Promise<RegisterResponse> {
		return ApiClient.post<RegisterResponse>('/auth/register', {
			...data,
			role: 'customer' satisfies UserRole,
		}, false);
	}
}
