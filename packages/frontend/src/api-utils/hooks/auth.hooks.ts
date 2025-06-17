'use client';

import type {
	LoginDto,
	LogoutDto,
	RefreshTokenDto,
	RegisterDto,
	SwitchRoleDto,
} from '../types/auth.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clearTokens, setTokens } from '@/lib/auth';
import { AuthService } from '../services/auth-service';

export const useLogin = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: LoginDto) => AuthService.login(data),
		onSuccess: (data) => {
			setTokens({
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				tokenId: data.tokenId,
			});
			router.push('/');
		},
	});
};

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: (data: RefreshTokenDto) => AuthService.refreshToken(data),
	});
};

export const useLogout = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: LogoutDto) => AuthService.logout(data),
		onSuccess: () => {
			clearTokens();
			router.push('/auth/login');
		},
	});
};

export const useLogoutAll = () => {
	return useMutation({
		mutationFn: () => AuthService.logoutAll(),
	});
};

export const useSwitchRole = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: SwitchRoleDto) => AuthService.switchRole(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'self'] });
		},
	});
};

export const useProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: () => AuthService.getProfile(),
		enabled: AuthService.isAuthenticated(),
	});
};

export const useActiveSessions = () => {
	return useQuery({
		queryKey: ['sessions'],
		queryFn: () => AuthService.getActiveSessions(),
		enabled: AuthService.isAuthenticated(),
	});
};

export const useRegister = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: RegisterDto) => AuthService.register(data),
		onSuccess: () => {
			router.push('/auth/login');
		},
	});
};
