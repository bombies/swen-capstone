import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CataloguesController } from 'src/catalogues/catalogues.controller';
import { CataloguesService } from 'src/catalogues/catalogues.service';
import { Catalogue, CatalogueSchema } from './schemas/catalogue.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Catalogue.name, schema: CatalogueSchema },
		]),
	],
	controllers: [CataloguesController],
	providers: [CataloguesService],
	exports: [CataloguesService],
})
export class CataloguesModule {}
