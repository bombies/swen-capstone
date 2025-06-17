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
	tokenId: string;
}

export interface SwitchRoleDto {
	role: UserRole;
	tokenId: string;
}

export interface LoginResponse {
	tokenId: string;
	accessToken: string;
	refreshToken: string;
	user: UserProfile;
}

export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
	tokenId: string;
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
	sub: string;
	email: string;
	role: UserRole;
	iat?: number;
	exp?: number;
}

export interface ApiError {
	message: string;
	statusCode: number;
}
export interface RegisterResponse {
	message: string;
}
