import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MerchantDocument } from 'src/merchants/merchant.schema';
import { MerchantService } from 'src/merchants/merchant.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument, PaymentStatus } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
	constructor(
		@InjectModel(Payment.name)
		private readonly paymentModel: Model<PaymentDocument>,
		private readonly merchantService: MerchantService,
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

	async getPaymentStats(userId: string): Promise<{
		totalAmount: number;
		totalTransactions: number;
		averageAmount: number;
		successRate: number;
	}> {
		const merchant = (await this.merchantService.findByUserId(userId)) as MerchantDocument;

		if (!merchant) {
			throw new NotFoundException('Merchant not found');
		}

		// Get all payments for the merchant
		const payments = await this.paymentModel
			.find({ merchant: merchant.id })
			.exec();

		// Calculate basic stats
		const totalTransactions = payments.length;
		const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
		const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

		// Calculate success rate (completed payments / total payments)
		const completedPayments = payments.filter(payment => payment.status === PaymentStatus.COMPLETED).length;
		const successRate = totalTransactions > 0 ? (completedPayments / totalTransactions) * 100 : 0;

		return {
			totalAmount,
			totalTransactions,
			averageAmount,
			successRate,
		};
	}
}
