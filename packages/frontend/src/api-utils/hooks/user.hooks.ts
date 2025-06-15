import type {
	CreateUserDto,
	UpdateUserDto,
} from '../types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/user-service';

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateUserDto) => UserService.createUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: () => UserService.getAllUsers(),
	});
};

export const useGetUserById = (id: string) => {
	return useQuery({
		queryKey: ['users', id],
		queryFn: () => UserService.getUserById(id),
		enabled: !!id,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
			UserService.updateUser(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['users', id] });
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => UserService.deleteUser(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['users', id] });
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};
