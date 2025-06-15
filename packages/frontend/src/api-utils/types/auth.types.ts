export type UserRole = 'admin' | 'merchant' | 'customer';

export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	username: string;
	firstName: string;
	lastName: string;
	eSignature: string;
	email: string;
	password: string;
}

export interface RefreshTokenDto {
	refreshToken: string;
}

export interface LogoutDto {
	refreshToken: string;
}

export interface SwitchRoleDto {
	role: UserRole;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: UserProfile;
}

export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}

export interface LogoutResponse {
	message: string;
}

export interface SwitchRoleResponse {
	accessToken: string;
	role: UserRole;
}

export interface UserProfile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
}

export interface Session {
	id: string;
	deviceInfo: {
		[key: string]: string;
	};
	lastActive: string;
}

export interface ApiError {
	message: string;
	statusCode: number;
}

export interface RegisterResponse {
	message: string;
}
