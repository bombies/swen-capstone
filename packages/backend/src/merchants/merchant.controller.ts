import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BecomeMerchantDto } from './dto/become-merchant.dto';
import { Merchant } from './merchant.schema';
import { MerchantService } from './merchant.service';

@ApiTags('merchants')
@Controller('merchants')
export class MerchantController {
	constructor(private readonly merchantService: MerchantService) {}

	@Post('become')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Become a merchant' })
	@ApiResponse({
		status: 201,
		description: 'Successfully became a merchant',
		type: Merchant,
	})
	@ApiResponse({ status: 400, description: 'Invalid input data' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async becomeMerchant(
		@CurrentUser('sub') user: string,
		@Body() dto: BecomeMerchantDto,
	) {
		return this.merchantService.becomeMerchant(user, dto);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get merchant profile' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved merchant profile',
		type: Merchant,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Merchant not found' })
	async getMyMerchantProfile(@CurrentUser('sub') user: string) {
		return this.merchantService.findByUserId(user);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get merchant profile' })
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved merchant profile',
		type: Merchant,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Merchant not found' })
	async getMerchantProfile(@Param('id') user: string) {
		return this.merchantService.findByUserId(user);
	}
}
