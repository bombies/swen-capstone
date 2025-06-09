import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
	) {}

	async create(email: string, password: string, firstName: string, lastName: string): Promise<User> {
		const existingUser = await this.UserModel.findOne({ email });
		if (existingUser) {
			throw new ConflictException('Email already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new this.UserModel({
			email,
			password: hashedPassword,
			firstName,
			lastName,
		});

		return newUser.save();
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.UserModel.findOne({ email }).exec();
	}

	async findById(id: string): Promise<User | null> {
		return this.UserModel.findById(id).exec();
	}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.findByEmail(email);
		if (!user) {
			return null;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return null;
		}

		return user;
	}

	async addRefreshToken(userId: string, token: string): Promise<void> {
		const user = await this.UserModel.findById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		user.refreshTokens.push(token);
		await user.save();
	}

	async removeRefreshToken(userId: string, token: string): Promise<void> {
		const user = await this.UserModel.findById(userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		user.refreshTokens = user.refreshTokens.filter(t => t !== token);
		await user.save();
	}

	async updateLastLogin(userId: string): Promise<void> {
		await this.UserModel.findByIdAndUpdate(userId, {
			lastLoginAt: new Date(),
		});
	}
}
