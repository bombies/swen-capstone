import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Merchant, MerchantSchema } from '../merchants/merchant.schema';
import { CataloguesController } from './catalogues.controller';
import { CataloguesService } from './catalogues.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: Merchant.name, schema: MerchantSchema },
		]),
	],
	controllers: [CataloguesController],
	providers: [UsersService, CataloguesService],
	exports: [CataloguesService],
})
export class CataloguesModule {}
