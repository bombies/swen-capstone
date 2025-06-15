import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserStatus } from './schemas/user.schema';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
		const createdUser = new this.userModel({
			...createUserDto,
			password: hashedPassword,
		});
		return createdUser.save();
	}

	async findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.userModel.findById(id).exec();
		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.userModel.findOne({ email }).exec();
		return user;
	}

	async findByUsername(username: string) {
		const user = await this.userModel.findOne({ username }).exec();
		return user;
	}

	async findByUsernameOrEmail(usernameOrEmail: string) {
		const user = await this.userModel
			.findOne({
				$or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
			})
			.exec();
		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (updateUserDto.password) {
			updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(id, updateUserDto, { new: true })
			.exec();

		return updatedUser as User;
	}

	async remove(id: string): Promise<void> {
		const result = await this.userModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('User not found');
		}
	}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.userModel.findOne({ email }).exec();
		if (!user) {
			return null;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return null;
		}

		return user;
	}

	async updateStatus(
		id: string,
		status: UserStatus,
		reason?: string,
	): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{
					status,
					...(reason && { statusReason: reason }),
				},
				{ new: true },
			)
			.exec();

		return updatedUser as User;
	}

	async verifyEmail(id: string): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.isEmailVerified) {
			throw new BadRequestException('Email is already verified');
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{ isEmailVerified: true },
				{ new: true },
			)
			.exec();

		return updatedUser as User;
	}

	async verifyPhone(id: string): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.isPhoneVerified) {
			throw new BadRequestException('Phone is already verified');
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{ isPhoneVerified: true },
				{ new: true },
			)
			.exec();

		return updatedUser as User;
	}

	async acceptTerms(
		id: string,
		ip: string,
		userAgent: string,
	): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.hasAcceptedTerms) {
			throw new BadRequestException('Terms have already been accepted');
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{
					hasAcceptedTerms: true,
					termsAcceptedAt: new Date(),
					termsAcceptedIp: ip,
					termsAcceptedUserAgent: userAgent,
				},
				{ new: true },
			)
			.exec();

		return updatedUser as User;
	}

	async updateLastLogin(id: string): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const updatedUser = await this.userModel
			.findByIdAndUpdate(
				id,
				{ lastLoginAt: new Date() },
				{ new: true },
			)
			.exec();

		return updatedUser as User;
	}
}
