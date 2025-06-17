import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from 'src/payments/payments.controller';
import { PaymentsService } from 'src/payments/payments.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Payment.name, schema: PaymentSchema },
		]),
	],
	controllers: [PaymentsController],
	providers: [UsersService, PaymentsService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
