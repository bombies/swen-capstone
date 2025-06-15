import type {
	CreateUserDto,
	UpdateUserDto,
	User,
} from '../types/user.types';
import { ApiClient } from '../api-client';

export class UserService {
	static async createUser(data: CreateUserDto): Promise<User> {
		return ApiClient.post<User>('/users', data);
	}

	static async getAllUsers(): Promise<User[]> {
		return ApiClient.get<User[]>('/users');
	}

	static async getUserById(id: string): Promise<User> {
		return ApiClient.get<User>(`/users/${id}`);
	}

	static async updateUser(id: string, data: UpdateUserDto): Promise<User> {
		return ApiClient.patch<User>(`/users/${id}`, data);
	}

	static async deleteUser(id: string): Promise<void> {
		return ApiClient.delete<void>(`/users/${id}`);
	}
}
