import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument, PaymentStatus } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
	constructor(
		@InjectModel(Payment.name)
		private readonly paymentModel: Model<PaymentDocument>,
	) {}

	async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
		const createdPayment = new this.paymentModel({
			...createPaymentDto,
			order: new Types.ObjectId(createPaymentDto.order),
			customer: new Types.ObjectId(createPaymentDto.customer),
			merchant: new Types.ObjectId(createPaymentDto.merchant),
		});
		return createdPayment.save();
	}

	async findAll(): Promise<Payment[]> {
		return this.paymentModel.find().exec();
	}

	async findById(id: string): Promise<Payment> {
		const payment = await this.paymentModel.findById(id).exec();
		if (!payment) {
			throw new NotFoundException('Payment not found');
		}
		return payment;
	}

	async findByOrder(orderId: string): Promise<Payment[]> {
		return this.paymentModel
			.find({ order: new Types.ObjectId(orderId) })
			.exec();
	}

	async findByCustomer(customerId: string): Promise<Payment[]> {
		return this.paymentModel
			.find({ customer: new Types.ObjectId(customerId) })
			.exec();
	}

	async findByMerchant(merchantId: string): Promise<Payment[]> {
		return this.paymentModel
			.find({ merchant: new Types.ObjectId(merchantId) })
			.exec();
	}

	async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
		const payment = await this.findById(id);
		if (!payment) {
			throw new NotFoundException('Payment not found');
		}

		const updatedPayment = await this.paymentModel
			.findByIdAndUpdate(id, updatePaymentDto, { new: true })
			.exec();

		return updatedPayment as Payment;
	}

	async remove(id: string): Promise<void> {
		const result = await this.paymentModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Payment not found');
		}
	}

	async updateStatus(
		id: string,
		status: PaymentStatus,
		errorMessage?: string,
	): Promise<Payment> {
		const payment = await this.findById(id);
		if (!payment) {
			throw new NotFoundException('Payment not found');
		}

		const updateData: any = { status };
		if (errorMessage) {
			updateData.errorMessage = errorMessage;
		}

		const updatedPayment = await this.paymentModel
			.findByIdAndUpdate(id, updateData, { new: true })
			.exec();

		return updatedPayment as Payment;
	}

	async refund(id: string, reason: string): Promise<Payment> {
		const payment = await this.findById(id);
		if (!payment) {
			throw new NotFoundException('Payment not found');
		}

		if (payment.status !== PaymentStatus.COMPLETED) {
			throw new BadRequestException('Only completed payments can be refunded');
		}

		const updatedPayment = await this.paymentModel
			.findByIdAndUpdate(
				id,
				{
					status: PaymentStatus.REFUNDED,
					refundReason: reason,
				},
				{ new: true },
			)
			.exec();

		return updatedPayment as Payment;
	}

	async getPaymentStats(merchantId: string): Promise<{
		total: number;
		completed: number;
		failed: number;
		refunded: number;
	}> {
		const stats = await this.paymentModel.aggregate([
			{ $match: { merchant: new Types.ObjectId(merchantId) } },
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 },
					total: { $sum: '$amount' },
				},
			},
		]);

		return {
			total: stats.reduce((acc, curr) => acc + curr.total, 0),
			completed: stats.find(s => s._id === PaymentStatus.COMPLETED)?.count ?? 0,
			failed: stats.find(s => s._id === PaymentStatus.FAILED)?.count ?? 0,
			refunded: stats.find(s => s._id === PaymentStatus.REFUNDED)?.count ?? 0,
		};
	}
}
