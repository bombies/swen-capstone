import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsController } from 'src/carts/carts.controller';
import { CartsService } from 'src/carts/carts.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Cart, CartSchema } from './schemas/cart.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Cart.name, schema: CartSchema },
		]),
	],
	controllers: [CartsController],
	providers: [UsersService, CartsService],
	exports: [CartsService],
})
export class CartsModule {}
