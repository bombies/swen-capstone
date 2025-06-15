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
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create a new review' })
	@ApiResponse({
		status: 201,
		description: 'The review has been successfully created.',
		type: Review,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async create(@Body() createReviewDto: CreateReviewDto) {
		return this.reviewsService.create(createReviewDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all reviews' })
	@ApiResponse({
		status: 200,
		description: 'Return all reviews.',
		type: [Review],
	})
	async findAll() {
		return this.reviewsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a review by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the review.',
		type: Review,
	})
	@ApiResponse({ status: 404, description: 'Review not found.' })
	async findOne(@Param('id') id: string) {
		return this.reviewsService.findById(id);
	}

	@Get('product/:productId')
	@ApiOperation({ summary: 'Get all reviews for a product' })
	@ApiResponse({
		status: 200,
		description: 'Return all reviews for the product.',
		type: [Review],
	})
	@ApiResponse({ status: 404, description: 'Product not found.' })
	async findByProduct(@Param('productId') productId: string) {
		return this.reviewsService.findByProduct(productId);
	}

	@Get('merchant/:merchantId')
	@ApiOperation({ summary: 'Get all reviews for a merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return all reviews for the merchant.',
		type: [Review],
	})
	@ApiResponse({ status: 404, description: 'Merchant not found.' })
	async findByMerchant(@Param('merchantId') merchantId: string) {
		return this.reviewsService.findByMerchant(merchantId);
	}

	@Get('customer/:customerId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all reviews by a customer' })
	@ApiResponse({
		status: 200,
		description: 'Return all reviews by the customer.',
		type: [Review],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Customer not found.' })
	async findByCustomer(@Param('customerId') customerId: string) {
		return this.reviewsService.findByUser(customerId);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update a review' })
	@ApiResponse({
		status: 200,
		description: 'The review has been successfully updated.',
		type: Review,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Review not found.' })
	async update(
		@Param('id') id: string,
		@Body() updateReviewDto: UpdateReviewDto,
	) {
		return this.reviewsService.update(id, updateReviewDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MERCHANT)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete a review' })
	@ApiResponse({
		status: 200,
		description: 'The review has been successfully deleted.',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Review not found.' })
	async remove(@Param('id') id: string) {
		return this.reviewsService.remove(id);
	}

	@Post(':id/helpful')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Mark a review as helpful' })
	@ApiResponse({
		status: 200,
		description: 'The review has been marked as helpful.',
		type: Review,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Review not found.' })
	async markAsHelpful(
		@Param('id') id: string,
		@Body('userId') userId: string,
	) {
		return this.reviewsService.markAsHelpful(id, userId);
	}

	@Delete(':id/helpful')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Remove helpful mark from a review' })
	@ApiResponse({
		status: 200,
		description: 'The helpful mark has been removed from the review.',
		type: Review,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Review not found.' })
	async removeHelpful(
		@Param('id') id: string,
		@Body('userId') userId: string,
	) {
		return this.reviewsService.unmarkAsHelpful(id, userId);
	}

	@Get('product/:productId/rating')
	@ApiOperation({ summary: 'Get all reviews for a product' })
	@ApiResponse({
		status: 200,
		description: 'Return all reviews for the product.',
		type: [Review],
	})
	@ApiResponse({ status: 404, description: 'Product not found.' })
	async getProductRating(@Param('productId') productId: string) {
		return this.reviewsService.findByProduct(productId);
	}
}
