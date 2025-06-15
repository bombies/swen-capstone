import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { PaymentStatus } from 'src/payments/schemas/payment.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Create a new order' })
	@ApiResponse({
		status: 201,
		description: 'The order has been successfully created.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all orders' })
	@ApiResponse({
		status: 200,
		description: 'Return all orders.',
		type: [Order],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async findAll() {
		return this.ordersService.findAll();
	}

	@Get('customer/:customerId')
	@Roles(UserRole.CUSTOMER, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all orders for a customer' })
	@ApiResponse({
		status: 200,
		description: 'Return all orders for the customer.',
		type: [Order],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Customer not found.' })
	async findByCustomer(@Param('customerId') customerId: string) {
		return this.ordersService.findByCustomer(customerId);
	}

	@Get('merchant/:merchantId')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all orders for a merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return all orders for the merchant.',
		type: [Order],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Merchant not found.' })
	async findByMerchant(@Param('merchantId') merchantId: string) {
		return this.ordersService.findByMerchant(merchantId);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a order by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the order.',
		type: Order,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async findOne(@Param('id') id: string) {
		return this.ordersService.findById(id);
	}

	@Patch(':id')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Update a order' })
	@ApiResponse({
		status: 200,
		description: 'The order has been successfully updated.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async update(
		@Param('id') id: string,
		@Body() updateOrderDto: UpdateOrderDto,
	) {
		return this.ordersService.update(id, updateOrderDto);
	}

	@Delete(':id')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Cancel an order' })
	@ApiResponse({
		status: 200,
		description: 'The order has been successfully cancelled.',
		type: Order,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async remove(@Param('id') id: string) {
		return this.ordersService.remove(id);
	}

	@Patch(':id/status')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Update order status' })
	@ApiResponse({
		status: 200,
		description: 'The order status has been successfully updated.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async updateStatus(
		@Param('id') id: string,
		@Body('status') status: OrderStatus,
		@Body('reason') reason?: string,
	) {
		return this.ordersService.updateStatus(id, status, reason);
	}

	@Patch(':orderId/payment-status')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Update order payment status' })
	@ApiResponse({
		status: 200,
		description: 'The order payment status has been successfully updated.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async updatePaymentStatus(
		@Param('orderId') orderId: string,
		@Body('paymentStatus') paymentStatus: PaymentStatus,
	) {
		return this.ordersService.updatePaymentStatus(
			orderId,
			paymentStatus,
		);
	}

	@Post(':id/refund')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Request a refund for an order' })
	@ApiResponse({
		status: 200,
		description: 'The refund request has been successfully submitted.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async requestRefund(
		@Param('id') id: string,
		@Body('reason') reason: string,
	) {
		return this.ordersService.requestRefund(id, reason);
	}

	@Patch(':id/tracking')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Update order tracking information' })
	@ApiResponse({
		status: 200,
		description: 'The order tracking information has been successfully updated.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async updateTracking(
		@Param('id') id: string,
		@Body('trackingNumber') trackingNumber: string,
		@Body('estimatedDeliveryDate') estimatedDeliveryDate: Date,
	) {
		return this.ordersService.updateTracking(
			id,
			trackingNumber,
			estimatedDeliveryDate,
		);
	}

	@Patch(':id/delivered')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Mark an order as delivered' })
	@ApiResponse({
		status: 200,
		description: 'The order has been successfully marked as delivered.',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Order not found.' })
	async markAsDelivered(@Param('id') id: string) {
		return this.ordersService.markAsDelivered(id);
	}
}
