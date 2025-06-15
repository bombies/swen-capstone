import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from 'src/payments/payments.controller';
import { PaymentsService } from 'src/payments/payments.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Payment.name, schema: PaymentSchema },
		]),
	],
	controllers: [PaymentsController],
	providers: [PaymentsService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
