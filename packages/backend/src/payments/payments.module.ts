import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CataloguesService } from 'src/catalogues/catalogues.service';
import { Merchant, MerchantSchema } from 'src/merchants/merchant.schema';
import { MerchantService } from 'src/merchants/merchant.service';
import { PaymentsController } from 'src/payments/payments.controller';
import { PaymentsService } from 'src/payments/payments.service';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Merchant.name, schema: MerchantSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: Payment.name, schema: PaymentSchema },
		]),
	],
	controllers: [PaymentsController],
	providers: [
		UsersService,
		MerchantService,
		CataloguesService,
		PaymentsService,
	],
	exports: [PaymentsService],
})
export class PaymentsModule {}
