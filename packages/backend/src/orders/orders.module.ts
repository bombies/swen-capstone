import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsService } from 'src/carts/carts.service';
import { Cart, CartSchema } from 'src/carts/schemas/cart.schema';
import { PaymentsService } from 'src/payments/payments.service';
import { Payment, PaymentSchema } from 'src/payments/schemas/payment.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Cart.name, schema: CartSchema },
			{ name: Payment.name, schema: PaymentSchema },
			{ name: Order.name, schema: OrderSchema },
		]),
	],
	controllers: [OrdersController],
	providers: [UsersService, CartsService, PaymentsService, OrdersService],
	exports: [OrdersService],
})
export class OrdersModule {}
