import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Merchant, MerchantSchema } from '../merchants/merchant.schema';
import { CataloguesController } from './catalogues.controller';
import { CataloguesService } from './catalogues.service';
import { Catalogue, CatalogueSchema } from './schemas/catalogue.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Catalogue.name, schema: CatalogueSchema },
			{ name: Merchant.name, schema: MerchantSchema },
		]),
	],
	controllers: [CataloguesController],
	providers: [UsersService, CataloguesService],
	exports: [CataloguesService],
})
export class CataloguesModule {}
