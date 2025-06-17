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
import { apiClient } from '@/api-utils/api-client';
import { clearTokens, setAccessToken, setTokens } from '@/lib/auth';

export class AuthService {
	static async login(data: LoginDto): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>('/auth/login', data);
		return response;
	}

	static async refreshToken(data: RefreshTokenDto): Promise<RefreshTokenResponse> {
		const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
		setTokens({
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
			tokenId: response.tokenId,
		});
		return response;
	}

	static async logout(data: LogoutDto): Promise<LogoutResponse> {
		const response = await apiClient.post<LogoutResponse>('/auth/logout', data);
		return response;
	}

	static async logoutAll(): Promise<LogoutResponse> {
		const response = await apiClient.post<LogoutResponse>('/auth/logout-all', {});
		clearTokens();
		return response;
	}

	static async switchRole(data: SwitchRoleDto): Promise<SwitchRoleResponse> {
		const response = await apiClient.post<SwitchRoleResponse>('/auth/switch-role', data);
		setAccessToken(response.accessToken);
		return response;
	}

	static async getProfile(): Promise<UserProfile> {
		return apiClient.get<UserProfile>('/auth/profile');
	}

	static async getActiveSessions(): Promise<Session[]> {
		return apiClient.get<Session[]>('/auth/sessions');
	}

	static isAuthenticated(): boolean {
		if (typeof window === 'undefined')
			return false;
		return !!localStorage.getItem('accessToken');
	}

	static getAccessToken(): string | null {
		if (typeof window === 'undefined')
			return null;
		return localStorage.getItem('accessToken');
	}

	static getRefreshToken(): string | null {
		if (typeof window === 'undefined')
			return null;
		return localStorage.getItem('refreshToken');
	}

	static async register(data: RegisterDto): Promise<RegisterResponse> {
		return apiClient.post<RegisterResponse>('/auth/register', {
			...data,
			role: 'customer' satisfies UserRole,
		});
	}
}
