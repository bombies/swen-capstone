import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsService } from 'src/carts/carts.service';
import { Cart, CartSchema } from 'src/carts/schemas/cart.schema';
import { CataloguesService } from 'src/catalogues/catalogues.service';
import { Merchant, MerchantSchema } from 'src/merchants/merchant.schema';
import { MerchantService } from 'src/merchants/merchant.service';
import { PaymentsService } from 'src/payments/payments.service';
import { Payment, PaymentSchema } from 'src/payments/schemas/payment.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Merchant.name, schema: MerchantSchema },
			{ name: Cart.name, schema: CartSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: Payment.name, schema: PaymentSchema },
			{ name: Order.name, schema: OrderSchema },
		]),
	],
	controllers: [OrdersController],
	providers: [
		UsersService,
		CartsService,
		MerchantService,
		CataloguesService,
		PaymentsService,
		OrdersService,
	],
	exports: [OrdersService],
})
export class OrdersModule {}
