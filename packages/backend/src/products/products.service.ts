import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: Model<ProductDocument>,
	) {}

	async create(createProductDto: CreateProductDto): Promise<Product> {
		const createdProduct = new this.productModel({
			...createProductDto,
			merchant: new Types.ObjectId(createProductDto.merchant),
		});
		return createdProduct.save();
	}

	async findAll(): Promise<Product[]> {
		return this.productModel.find().exec();
	}

	async findById(id: string): Promise<Product> {
		const product = await this.productModel.findById(id).exec();
		if (!product) {
			throw new NotFoundException('Product not found');
		}
		return product;
	}

	async findByMerchant(merchantId: string): Promise<Product[]> {
		return this.productModel
			.find({ merchant: new Types.ObjectId(merchantId) })
			.exec();
	}

	async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
		const product = await this.findById(id);
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		const updatedProduct = await this.productModel
			.findByIdAndUpdate(id, updateProductDto, { new: true })
			.exec();

		return updatedProduct as Product;
	}

	async remove(id: string): Promise<void> {
		const result = await this.productModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Product not found');
		}
	}

	async updateStock(id: string, quantity: number): Promise<Product> {
		const product = await this.findById(id);
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		if (product.stock + quantity < 0) {
			throw new BadRequestException('Insufficient stock');
		}

		const updatedProduct = await this.productModel
			.findByIdAndUpdate(
				id,
				{ $inc: { stock: quantity } },
				{ new: true },
			)
			.exec();

		return updatedProduct as Product;
	}

	async updateRating(id: string, rating: number): Promise<Product> {
		const product = await this.findById(id);
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		const updatedProduct = await this.productModel
			.findByIdAndUpdate(
				id,
				{
					$inc: { reviewCount: 1 },
					rating: (product.rating * product.reviewCount + rating) / (product.reviewCount + 1),
				},
				{ new: true },
			)
			.exec();

		return updatedProduct as Product;
	}

	async search(query: string): Promise<Product[]> {
		return this.productModel
			.find({
				$or: [
					{ name: { $regex: query, $options: 'i' } },
					{ description: { $regex: query, $options: 'i' } },
				],
			})
			.exec();
	}

	async findByCategory(category: string): Promise<Product[]> {
		return this.productModel.find({ categories: category }).exec();
	}
}
