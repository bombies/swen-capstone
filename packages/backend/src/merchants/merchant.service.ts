import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CataloguesService } from '../catalogues/catalogues.service';
import { BecomeMerchantDto } from './dto/become-merchant.dto';
import { Merchant, MerchantDocument } from './merchant.schema';

@Injectable()
export class MerchantService {
	constructor(
		@InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
		private readonly userService: UsersService,
		private readonly cataloguesService: CataloguesService,
	) {}

	async becomeMerchant(user: string, dto: BecomeMerchantDto): Promise<Merchant> {
		const existingMerchant = await this.findByUserId(user);
		if (existingMerchant) {
			throw new BadRequestException('User is already a merchant');
		}

		const merchant = new this.merchantModel({
			user,
			companyName: dto.companyName,
			companyAddress: dto.companyAddress,
			companyPhone: dto.companyPhone,
			isCompliant: false,
		});

		const savedMerchant = await merchant.save();

		await this.userService.addRole(user, UserRole.MERCHANT);

		return savedMerchant;
	}

	async findByUserId(userId: string): Promise<Merchant | null> {
		const merchant = await this.merchantModel.findOne({ user: userId }).exec();
		if (!merchant) {
			return null;
		}
		return merchant;
	}

	async updateCompliance(merchantId: string, isCompliant: boolean): Promise<Merchant> {
		const merchant = await this.merchantModel
			.findByIdAndUpdate(
				merchantId,
				{ isCompliant, verificationExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
				{ new: true },
			)
			.exec();

		if (!merchant) {
			throw new NotFoundException('Merchant not found');
		}

		return merchant;
	}
}
