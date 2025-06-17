import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CataloguesService } from '../catalogues/catalogues.service';
import { Catalogue, CatalogueSchema } from '../catalogues/schemas/catalogue.schema';
import { MerchantController } from './merchant.controller';
import { Merchant, MerchantSchema } from './merchant.schema';
import { MerchantService } from './merchant.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Merchant.name, schema: MerchantSchema },
			{ name: Catalogue.name, schema: CatalogueSchema },
		]),
	],
	controllers: [MerchantController],
	providers: [UsersService, MerchantService, CataloguesService],
	exports: [MerchantService],
})
export class MerchantModule {}
