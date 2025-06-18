import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Create a new product' })
	@ApiResponse({
		status: 201,
		description: 'The product has been successfully created.',
		type: Product,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	create(@Body() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
	}

	@Get()
	@Public()
	@ApiOperation({ summary: 'Get all products' })
	@ApiResponse({
		status: 200,
		description: 'Return all products.',
		type: [Product],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	findAll() {
		return this.productsService.findAll();
	}

	@Get('search')
	@Public()
	@ApiOperation({ summary: 'Search products' })
	@ApiQuery({
		name: 'q',
		description: 'Search query',
		required: true,
		type: String,
	})
	@ApiResponse({
		status: 200,
		description: 'Return matching products.',
		type: [Product],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	async search(@Query('q') query: string) {
		return this.productsService.search(query);
	}

	@Get('category/:category')
	@Public()
	@ApiOperation({ summary: 'Get products by category' })
	@ApiResponse({
		status: 200,
		description: 'Return products in the specified category.',
		type: [Product],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Category not found.' })
	async findByCategory(@Param('category') category: string) {
		return this.productsService.findByCategory(category);
	}

	@Get('merchant/:merchantId')
	@Public()
	@ApiOperation({ summary: 'Get products by merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return products for the specified merchant.',
		type: [Product],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Merchant not found.' })
	async findByMerchant(@Param('merchantId') merchantId: string) {
		return this.productsService.findByMerchant(merchantId);
	}

	@Get(':id')
	@Public()
	@ApiOperation({ summary: 'Get a product by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the product.',
		type: Product,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Product not found.' })
	findOne(@Param('id') id: string) {
		return this.productsService.findById(id);
	}

	@Patch(':id')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Update a product' })
	@ApiResponse({
		status: 200,
		description: 'The product has been successfully updated.',
		type: Product,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Product not found.' })
	update(
		@Param('id') id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.update(id, updateProductDto);
	}

	@Delete(':id')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Delete a product' })
	@ApiResponse({
		status: 200,
		description: 'The product has been successfully deleted.',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Product not found.' })
	remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}
}
