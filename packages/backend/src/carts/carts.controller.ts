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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CartsService } from './carts.service';
import { CreateCartDto, CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schemas/cart.schema';

@ApiTags('carts')
@Controller('carts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Post()
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Create a new cart' })
	@ApiResponse({
		status: 201,
		description: 'The cart has been successfully created.',
		type: Cart,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async create(@Body() createCartDto: CreateCartDto) {
		return this.cartsService.create(createCartDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all carts' })
	@ApiResponse({
		status: 200,
		description: 'Return all carts.',
		type: [Cart],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async findAll(@CurrentUser('sub') userId: string) {
		return this.cartsService.findByCustomer(userId);
	}

	@Get('customer/:customerId')
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all carts for a customer' })
	@ApiResponse({
		status: 200,
		description: 'Return all carts for the customer.',
		type: [Cart],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Customer not found.' })
	async findByCustomer(@Param('customerId') customerId: string) {
		return this.cartsService.findByCustomer(customerId);
	}

	@Get(':id')
	@Roles(UserRole.CUSTOMER, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get a cart by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the cart.',
		type: Cart,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async findOne(@Param('id') id: string) {
		return this.cartsService.findByIdWithPopulatedRefs(id);
	}

	@Patch(':id')
	@Roles(UserRole.CUSTOMER, UserRole.ADMIN)
	@ApiOperation({ summary: 'Update a cart' })
	@ApiResponse({
		status: 200,
		description: 'The cart has been successfully updated.',
		type: Cart,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async update(
		@Param('id') id: string,
		@Body() updateCartDto: UpdateCartDto,
	) {
		return this.cartsService.update(id, updateCartDto);
	}

	@Delete(':id')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Delete a cart' })
	@ApiResponse({
		status: 200,
		description: 'The cart has been successfully deleted.',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async remove(
		@CurrentUser('sub') userId: string,
		@Param('id') id: string,
	) {
		return this.cartsService.remove(userId, id);
	}

	@Post(':id/items')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Add an item to the cart' })
	@ApiResponse({
		status: 200,
		description: 'The item has been successfully added to the cart.',
		type: Cart,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async addItem(
		@Param('id') id: string,
		@Body() item: CreateCartItemDto,
	) {
		return this.cartsService.addItem(id, item);
	}

	@Delete(':id/items/:productId/:merchantId')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Remove an item from the cart' })
	@ApiResponse({
		status: 200,
		description: 'The item has been successfully removed from the cart.',
		type: Cart,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart or item not found.' })
	async removeItem(
		@Param('id') id: string,
		@Param('productId') productId: string,
		@Param('merchantId') merchantId: string,
	) {
		return this.cartsService.removeItem(id, productId, merchantId);
	}

	@Patch(':id/items/:productId/:merchantId/quantity')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Update item quantity in the cart' })
	@ApiResponse({
		status: 200,
		description: 'The item quantity has been successfully updated.',
		type: Cart,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart or item not found.' })
	async updateItemQuantity(
		@Param('id') id: string,
		@Param('productId') productId: string,
		@Param('merchantId') merchantId: string,
		@Body('quantity') quantity: number,
	) {
		return this.cartsService.updateItemQuantity(
			id,
			productId,
			merchantId,
			quantity,
		);
	}

	@Post(':id/clear')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Clear all items from the cart' })
	@ApiResponse({
		status: 200,
		description: 'The cart has been successfully cleared.',
		type: Cart,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async clearCart(@Param('id') id: string) {
		return this.cartsService.clearCart(id);
	}

	@Post(':id/abandon')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Mark a cart as abandoned' })
	@ApiResponse({
		status: 200,
		description: 'The cart has been successfully marked as abandoned.',
		type: Cart,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async markAsAbandoned(@Param('id') id: string) {
		return this.cartsService.markAsAbandoned(id);
	}

	@Post(':id/checkout')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Mark a cart as checked out' })
	@ApiResponse({
		status: 200,
		description: 'The cart has been successfully marked as checked out.',
		type: Cart,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async markAsCheckedOut(@Param('id') id: string) {
		return this.cartsService.markAsCheckedOut(id);
	}

	@Post(':id/calculate')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Calculate cart totals' })
	@ApiResponse({
		status: 200,
		description: 'The cart totals have been successfully calculated.',
		type: Cart,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Cart not found.' })
	async calculateTotals(@Param('id') id: string) {
		return this.cartsService.calculateTotals(id);
	}
}
