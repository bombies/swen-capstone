import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CataloguesService } from '../catalogues/catalogues.service';
import { MerchantController } from './merchant.controller';
import { Merchant, MerchantSchema } from './merchant.schema';
import { MerchantService } from './merchant.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: Merchant.name, schema: MerchantSchema },
		]),
	],
	controllers: [MerchantController],
	providers: [UsersService, MerchantService, CataloguesService],
	exports: [MerchantService],
})
export class MerchantModule {}
