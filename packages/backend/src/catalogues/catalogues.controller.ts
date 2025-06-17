import {
	Controller,
	Get,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Product } from 'src/products/schemas/product.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CataloguesService } from './catalogues.service';

@ApiTags('catalogues')
@Controller('catalogues')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CataloguesController {
	constructor(private readonly cataloguesService: CataloguesService) {}

	@Get()
	async getCatalogueProducts() {
		return this.cataloguesService.getCatalogueProducts();
	}

	@Get('me')
	@Roles(UserRole.MERCHANT)
	@ApiOperation({ summary: 'Get my catalogue' })
	@ApiResponse({
		status: 200,
		description: 'Return the merchant\'s catalogue.',
		type: [Product],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Catalogue not found.' })
	async findMyCatalogue(@CurrentUser('sub') userId: string) {
		return this.cataloguesService.findMyCatalogue(userId);
	}

	@Get('merchant')
	@Roles(UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all catalogues for a merchant' })
	@ApiResponse({
		status: 200,
		description: 'Return all catalogues for the merchant.',
		type: [Product],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'Merchant not found.' })
	async findByMerchant(@CurrentUser('sub') userId: string) {
		return this.cataloguesService.findByMerchant(userId);
	}
}
