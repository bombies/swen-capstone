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
import { CataloguesService } from './catalogues.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { Catalogue } from './schemas/catalogue.schema';

@ApiTags('catalogues')
@Controller('catalogues')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CataloguesController {
	constructor(private readonly cataloguesService: CataloguesService) {}

	@Post()
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Create a new catalogue' })
	@ApiResponse({
		status: 201,
		description: 'The catalogue has been successfully created.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async create(
		@CurrentUser('id') merchantId: string,
		@Body() createCatalogueDto: CreateCatalogueDto,
	) {
		return this.cataloguesService.create({
			...createCatalogueDto,
			merchant: merchantId,
		});
	}

	@Get()
	@Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all catalogues' })
	@ApiResponse({
		status: 200,
		description: 'Return all catalogues.',
		type: [Catalogue],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async findAll() {
		return this.cataloguesService.findAll();
	}

	@Get('merchant')
	@Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all catalogues for a merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return all catalogues for the merchant.',
		type: [Catalogue],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Merchant not found.' })
	async findByMerchant(@CurrentUser('id') merchantId: string) {
		return this.cataloguesService.findByMerchant(merchantId);
	}

	@Get(':id')
	@Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get a catalogue by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the catalogue.',
		type: Catalogue,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async findOne(@Param('id') id: string) {
		return this.cataloguesService.findById(id);
	}

	@Patch(':id')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Update a catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The catalogue has been successfully updated.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async update(
		@Param('id') id: string,
		@Body() updateCatalogueDto: UpdateCatalogueDto,
	) {
		return this.cataloguesService.update(id, updateCatalogueDto);
	}

	@Delete(':id')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Delete a catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The catalogue has been successfully deleted.',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async remove(@Param('id') id: string) {
		return this.cataloguesService.remove(id);
	}

	@Post(':id/products/:productId')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Add a product to the catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The product has been successfully added to the catalogue.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue or product not found.' })
	async addProduct(
		@Param('id') id: string,
		@Param('productId') productId: string,
	) {
		return this.cataloguesService.addProduct(id, productId);
	}

	@Delete(':id/products/:productId')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Remove a product from the catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The product has been successfully removed from the catalogue.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue or product not found.' })
	async removeProduct(
		@Param('id') id: string,
		@Param('productId') productId: string,
	) {
		return this.cataloguesService.removeProduct(id, productId);
	}

	@Post(':id/publish')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Publish a catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The catalogue has been successfully published.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async publish(@Param('id') id: string) {
		return this.cataloguesService.publish(id);
	}

	@Post(':id/unpublish')
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Unpublish a catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The catalogue has been successfully unpublished.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async unpublish(@Param('id') id: string) {
		return this.cataloguesService.unpublish(id);
	}

	@Post(':id/view')
	@ApiOperation({ summary: 'Increment catalogue view count' })
	@ApiResponse({
		status: 200,
		description: 'The catalogue view count has been successfully incremented.',
		type: Catalogue,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async incrementViewCount(@Param('id') id: string) {
		return this.cataloguesService.incrementViewCount(id);
	}

	@Post(':id/rate')
	@Roles(UserRole.CUSTOMER)
	@ApiOperation({ summary: 'Rate a catalogue' })
	@ApiResponse({
		status: 200,
		description: 'The catalogue has been successfully rated.',
		type: Catalogue,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async rate(
		@Param('id') id: string,
		@Body('rating') rating: number,
	) {
		return this.cataloguesService.updateRating(id, rating);
	}
}
