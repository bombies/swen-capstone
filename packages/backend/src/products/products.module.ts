import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from 'src/products/products.controller';
import { ProductsService } from 'src/products/products.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	controllers: [ProductsController],
	providers: [UsersService, ProductsService],
	exports: [ProductsService],
})
export class ProductsModule {}
