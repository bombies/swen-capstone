import type { UserRole } from '@/api-utils/types/auth.types';

export type UserStatus = 'pending' | 'active' | 'suspended' | 'deleted';

export interface CreateUserDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone?: string;
	address?: string;
	roles: UserRole[];
	activeRole: UserRole;
	acceptedTermsAndPrivacy: boolean;
	policiesAcceptedAt?: string;
}

export interface UpdateUserDto {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	role?: UserRole;
	roles?: UserRole[];
	activeRole?: UserRole;
	status?: UserStatus;
	phone?: string;
	address?: string;
	profilePicture?: string;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	address?: string;
	roles: UserRole[];
	activeRole: UserRole;
	status: UserStatus;
	profilePicture?: string;
	acceptedTermsAndPrivacy: boolean;
	policiesAcceptedAt?: string;
	createdAt: string;
	updatedAt: string;
}
