import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCartDto, CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartsService {
	constructor(
		@InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
	) {}

	async create(createCartDto: CreateCartDto): Promise<Cart> {
		const createdCart = new this.cartModel({
			...createCartDto,
			customer: new Types.ObjectId(createCartDto.customer),
			items: createCartDto.items?.map(item => ({
				...item,
				product: new Types.ObjectId(item.product),
				merchant: new Types.ObjectId(item.merchant),
			})),
			lastUpdatedAt: new Date(),
		});

		return createdCart.save();
	}

	async findAll(): Promise<Cart[]> {
		return this.cartModel.find().exec();
	}

	async findById(id: string): Promise<Cart> {
		const cart = await this.cartModel.findById(id).exec();
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}
		return cart;
	}

	async findByCustomer(customerId: string): Promise<Cart[]> {
		return this.cartModel
			.find({ customer: new Types.ObjectId(customerId) })
			.exec();
	}

	async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
		const updateData: any = { ...updateCartDto };

		if (updateCartDto.items) {
			updateData.items = updateCartDto.items.map(item => ({
				...item,
				product: new Types.ObjectId(item.product),
				merchant: new Types.ObjectId(item.merchant),
			}));
		}

		updateData.lastUpdatedAt = new Date();

		const updatedCart = await this.cartModel
			.findByIdAndUpdate(id, updateData, { new: true })
			.exec();

		if (!updatedCart) {
			throw new NotFoundException('Cart not found');
		}

		return updatedCart;
	}

	async remove(id: string): Promise<void> {
		const result = await this.cartModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Cart not found');
		}
	}

	async addItem(
		cartId: string,
		item: CreateCartItemDto,
	): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		const existingItemIndex = cart.items.findIndex(
			i =>
				i.product.equals(new Types.ObjectId(item.product))
				&& i.merchant.equals(new Types.ObjectId(item.merchant)),
		);

		if (existingItemIndex > -1) {
			cart.items[existingItemIndex].quantity += item.quantity;
		} else {
			cart.items.push({
				...item,
				product: new Types.ObjectId(item.product),
				merchant: new Types.ObjectId(item.merchant),
			});
		}

		cart.lastUpdatedAt = new Date();
		return cart.save();
	}

	async removeItem(
		cartId: string,
		productId: string,
		merchantId: string,
	): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		cart.items = cart.items.filter(
			item =>
				!item.product.equals(new Types.ObjectId(productId))
				|| !item.merchant.equals(new Types.ObjectId(merchantId)),
		);

		cart.lastUpdatedAt = new Date();
		return cart.save();
	}

	async updateItemQuantity(
		cartId: string,
		productId: string,
		merchantId: string,
		quantity: number,
	): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		const itemIndex = cart.items.findIndex(
			item =>
				item.product.equals(new Types.ObjectId(productId))
				&& item.merchant.equals(new Types.ObjectId(merchantId)),
		);

		if (itemIndex === -1) {
			throw new NotFoundException('Item not found in cart');
		}

		if (quantity <= 0) {
			cart.items.splice(itemIndex, 1);
		} else {
			cart.items[itemIndex].quantity = quantity;
		}

		cart.lastUpdatedAt = new Date();
		return cart.save();
	}

	async clearCart(cartId: string): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		cart.items = [];
		cart.lastUpdatedAt = new Date();
		return cart.save();
	}

	async markAsAbandoned(cartId: string): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		if (cart.isAbandoned) {
			throw new BadRequestException('Cart is already abandoned');
		}

		cart.isAbandoned = true;
		cart.abandonedAt = new Date();
		cart.lastUpdatedAt = new Date();

		return cart.save();
	}

	async markAsCheckedOut(cartId: string): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		if (cart.isCheckedOut) {
			throw new BadRequestException('Cart is already checked out');
		}

		cart.isCheckedOut = true;
		cart.checkedOutAt = new Date();
		cart.lastUpdatedAt = new Date();

		return cart.save();
	}

	async calculateTotals(cartId: string): Promise<Cart> {
		const cart = (await this.findById(cartId)) as CartDocument;
		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		cart.totalItems = cart.items.reduce(
			(total, item) => total + item.quantity,
			0,
		);
		cart.totalAmount = cart.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);
		cart.lastUpdatedAt = new Date();

		return cart.save();
	}
}
