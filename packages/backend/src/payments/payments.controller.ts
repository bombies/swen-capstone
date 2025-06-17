import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';
import { Payment } from './schemas/payment.schema';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@Post()
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Create a new payment' })
	@ApiResponse({
		status: 201,
		description: 'The payment has been successfully created.',
		type: Payment,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async create(
		@CurrentUser('sub') customerId: string,
		@Body() createPaymentDto: CreatePaymentDto,
	) {
		return this.paymentsService.create({
			...createPaymentDto,
			customer: customerId,
		});
	}

	@Get()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all payments' })
	@ApiResponse({
		status: 200,
		description: 'Return all payments.',
		type: [Payment],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async findAll() {
		return this.paymentsService.findAll();
	}

	@Get('order/:orderId')
	@ApiOperation({ summary: 'Get payment by order ID' })
	@ApiResponse({
		status: 200,
		description: 'Return the payment for the specified order.',
		type: Payment,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async findByOrder(@Param('orderId') orderId: string) {
		return this.paymentsService.findByOrder(orderId);
	}

	@Get('customer')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Get all payments for the current customer' })
	@ApiResponse({
		status: 200,
		description: 'Return all payments for the current customer.',
		type: [Payment],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async findByCustomer(@CurrentUser('sub') customerId: string) {
		return this.paymentsService.findByCustomer(customerId);
	}

	@Get('merchant')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Get all payments for the current merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return all payments for the current merchant.',
		type: [Payment],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async findByMerchant(@CurrentUser('sub') merchantId: string) {
		return this.paymentsService.findByMerchant(merchantId);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a payment by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the payment.',
		type: Payment,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Payment not found.' })
	async findOne(@Param('id') id: string) {
		return this.paymentsService.findById(id);
	}

	@Patch(':id')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Update a payment' })
	@ApiResponse({
		status: 200,
		description: 'The payment has been successfully updated.',
		type: Payment,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Payment not found.' })
	async update(
		@Param('id') id: string,
		@Body() updatePaymentDto: UpdatePaymentDto,
	) {
		return this.paymentsService.update(id, updatePaymentDto);
	}

	@Post(':id/refund')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Refund a payment' })
	@ApiResponse({
		status: 200,
		description: 'The payment has been successfully refunded.',
		type: Payment,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Payment not found.' })
	async refund(
		@Param('id') id: string,
		@Body('reason') reason: string,
	) {
		return this.paymentsService.refund(id, reason);
	}

	@Get('merchant/stats')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Get payment statistics for the current merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return payment statistics for the current merchant.',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async getPaymentStats(@CurrentUser('sub') merchantId: string) {
		return this.paymentsService.getPaymentStats(merchantId);
	}
}
