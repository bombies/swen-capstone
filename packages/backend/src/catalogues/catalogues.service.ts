import {
	BadRequestException,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { Merchant } from '../merchants/merchant.schema';

@Injectable()
export class CataloguesService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<Product>,
		@InjectModel(Merchant.name)
		private readonly merchantModel: Model<Merchant>,
	) {}

	async findByMerchant(userId: string): Promise<Product[]> {
		const merchant = await this.merchantModel.findOne({ user: userId }).exec();
		if (!merchant) {
			throw new BadRequestException('User is not a merchant');
		}

		return this.productModel
			.find({ merchant: merchant._id })
			.exec();
	}

	async findMyCatalogue(userId: string): Promise<Product[]> {
		const merchant = await this.merchantModel.findOne({ user: userId }).exec();
		if (!merchant) {
			return [];
		}

		return this.productModel
			.find({ merchant: merchant._id })
			.exec();
	}

	async getCatalogueProducts(): Promise<Product[]> {
		return this.productModel.find().exec();
	}
}
