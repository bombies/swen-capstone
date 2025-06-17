import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartsService } from 'src/carts/carts.service';
import { CartDocument } from 'src/carts/schemas/cart.schema';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentMethod, PaymentStatus } from 'src/payments/schemas/payment.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
	constructor(
		@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
		private readonly cartService: CartsService,
		private readonly paymentService: PaymentsService,
	) {}

	async create(createOrderDto: CreateOrderDto): Promise<Order> {
		const cart = (await this.cartService.findById(createOrderDto.cart)) as CartDocument;

		if (!cart) {
			throw new BadRequestException('Invalid cart!');
		}

		const createdOrder = new this.orderModel({
			...createOrderDto,
			customer: new Types.ObjectId(createOrderDto.customer),
			items: createOrderDto.items.map(item => ({
				...item,
				product: new Types.ObjectId(item.product),
				merchant: new Types.ObjectId(item.merchant),
			})),
		});

		// Delete the cart
		await cart.deleteOne().exec();

		// Create a payment records
		for (const item of createOrderDto.items) {
			await this.paymentService.create({
				order: createdOrder.id,
				amount: item.price * item.quantity,
				merchant: item.merchant,
				customer: createOrderDto.customer,
				method: PaymentMethod.DEBIT_CARD,
			});
		}

		return createdOrder.save();
	}

	async findAll(): Promise<Order[]> {
		return this.orderModel.find().exec();
	}

	async findById(id: string): Promise<Order> {
		const order = await this.orderModel.findById(id).exec();
		if (!order) {
			throw new NotFoundException('Order not found');
		}
		return order;
	}

	async findByCustomer(customerId: string): Promise<Order[]> {
		return this.orderModel
			.find({ customer: new Types.ObjectId(customerId) })
			.exec();
	}

	async findByMerchant(merchantId: string): Promise<Order[]> {
		return this.orderModel
			.find({ 'items.merchant': new Types.ObjectId(merchantId) })
			.exec();
	}

	async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
		const order = await this.findById(id);
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		const updatedOrder = await this.orderModel
			.findByIdAndUpdate(id, updateOrderDto, { new: true })
			.exec();

		return updatedOrder as Order;
	}

	async remove(id: string): Promise<void> {
		const result = await this.orderModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Order not found');
		}
	}

	async updateStatus(
		id: string,
		status: OrderStatus,
		reason?: string,
	): Promise<Order> {
		const order = await this.findById(id);
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		const updateData: any = { status };
		if (reason) {
			updateData.cancellationReason = reason;
		}

		switch (status) {
			case OrderStatus.PROCESSING:
				updateData.processedAt = new Date();
				break;
			case OrderStatus.COMPLETED:
				updateData.completedAt = new Date();
				break;
			case OrderStatus.CANCELLED:
				updateData.cancelledAt = new Date();
				break;
			case OrderStatus.REFUNDED:
				updateData.refundedAt = new Date();
				break;
		}

		const updatedOrder = await this.orderModel
			.findByIdAndUpdate(id, updateData, { new: true })
			.exec();

		return updatedOrder as Order;
	}

	async updatePaymentStatus(
		orderId: string,
		status: PaymentStatus,
	): Promise<Order> {
		const order = await this.findById(orderId);
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		const updatedOrder = await this.orderModel
			.findByIdAndUpdate(
				orderId,
				{ paymentStatus: status },
				{ new: true },
			)
			.exec();

		return updatedOrder as Order;
	}

	async requestRefund(
		id: string,
		reason: string,
	): Promise<Order> {
		const order = (await this.findById(id)) as OrderDocument;
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		if (order.status !== OrderStatus.DELIVERED) {
			throw new BadRequestException(
				'Only delivered orders can be refunded',
			);
		}

		order.refundReason = reason;
		order.status = OrderStatus.REFUNDED;
		order.paymentStatus = PaymentStatus.REFUNDED;

		return order.save();
	}

	async updateTracking(
		id: string,
		trackingNumber: string,
		estimatedDeliveryDate: Date,
	): Promise<Order> {
		const order = (await this.findById(id)) as OrderDocument;
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		if (order.status !== OrderStatus.PROCESSING) {
			throw new BadRequestException(
				'Only processing orders can be updated with tracking',
			);
		}

		order.trackingNumber = trackingNumber;
		order.estimatedDeliveryDate = estimatedDeliveryDate;
		order.status = OrderStatus.SHIPPED;

		return order.save();
	}

	async markAsDelivered(id: string): Promise<Order> {
		const order = (await this.findById(id)) as OrderDocument;
		if (!order) {
			throw new NotFoundException('Order not found');
		}

		if (order.status !== OrderStatus.SHIPPED) {
			throw new BadRequestException(
				'Only shipped orders can be marked as delivered',
			);
		}

		order.status = OrderStatus.DELIVERED;
		return order.save();
	}
}
