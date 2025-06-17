import type {
	CreateUserDto,
	UpdateUserDto,
	User,
} from '../types/user.types';
import { apiClient } from '../api-client';

export class UserService {
	static async createUser(data: CreateUserDto): Promise<User> {
		return apiClient.post<User>('/users', data);
	}

	static async getSelf(): Promise<User> {
		return apiClient.get<User>('/users/self');
	}

	static async getAllUsers(): Promise<User[]> {
		return apiClient.get<User[]>('/users');
	}

	static async getUserById(id: string): Promise<User> {
		return apiClient.get<User>(`/users/${id}`);
	}

	static async updateUser(id: string, data: UpdateUserDto): Promise<User> {
		return apiClient.patch<User>(`/users/${id}`, data);
	}

	static async deleteUser(id: string): Promise<void> {
		return apiClient.delete<void>(`/users/${id}`);
	}
}
