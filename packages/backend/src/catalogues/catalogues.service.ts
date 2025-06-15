import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { Catalogue, CatalogueDocument, CatalogueStatus } from './schemas/catalogue.schema';

@Injectable()
export class CataloguesService {
	constructor(
		@InjectModel(Catalogue.name)
		private readonly catalogueModel: Model<Catalogue>,
	) {}

	async create(createCatalogueDto: CreateCatalogueDto): Promise<Catalogue> {
		const createdCatalogue = new this.catalogueModel({
			...createCatalogueDto,
			merchant: new Types.ObjectId(createCatalogueDto.merchant),
			products: createCatalogueDto.products?.map(
				p => new Types.ObjectId(p),
			),
		});

		return createdCatalogue.save();
	}

	async findAll(): Promise<Catalogue[]> {
		return this.catalogueModel.find().exec();
	}

	async findById(id: string): Promise<Catalogue> {
		const catalogue = await this.catalogueModel.findById(id).exec();
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}
		return catalogue;
	}

	async findByMerchant(merchantId: string): Promise<Catalogue[]> {
		return this.catalogueModel
			.find({ merchant: new Types.ObjectId(merchantId) })
			.exec();
	}

	async update(
		id: string,
		updateCatalogueDto: UpdateCatalogueDto,
	): Promise<Catalogue> {
		const updateData: any = { ...updateCatalogueDto };

		if (updateCatalogueDto.products) {
			updateData.products = updateCatalogueDto.products.map(
				p => new Types.ObjectId(p),
			);
		}

		const updatedCatalogue = await this.catalogueModel
			.findByIdAndUpdate(id, updateData, { new: true })
			.exec();

		if (!updatedCatalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		return updatedCatalogue;
	}

	async remove(id: string): Promise<void> {
		const result = await this.catalogueModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Catalogue not found');
		}
	}

	async addProduct(
		catalogueId: string,
		productId: string,
	): Promise<Catalogue> {
		const catalogue = (await this.findById(catalogueId)) as CatalogueDocument;
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		if (catalogue.products.includes(new Types.ObjectId(productId))) {
			throw new BadRequestException('Product already in catalogue');
		}

		catalogue.products.push(new Types.ObjectId(productId));
		catalogue.productCount = catalogue.products.length;

		return catalogue.save();
	}

	async removeProduct(
		catalogueId: string,
		productId: string,
	): Promise<Catalogue> {
		const catalogue = (await this.findById(catalogueId)) as CatalogueDocument;
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		catalogue.products = catalogue.products.filter(
			p => !p.equals(new Types.ObjectId(productId)),
		);
		catalogue.productCount = catalogue.products.length;

		return catalogue.save();
	}

	async publish(id: string): Promise<Catalogue> {
		const catalogue = (await this.findById(id)) as CatalogueDocument;
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		if (catalogue.status === CatalogueStatus.ACTIVE) {
			throw new BadRequestException('Catalogue is already published');
		}

		catalogue.status = CatalogueStatus.ACTIVE;
		catalogue.publishedAt = new Date();
		catalogue.isPublic = true;

		return catalogue.save();
	}

	async unpublish(id: string): Promise<Catalogue> {
		const catalogue = (await this.findById(id)) as CatalogueDocument;
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		if (catalogue.status === CatalogueStatus.INACTIVE) {
			throw new BadRequestException('Catalogue is already unpublished');
		}

		catalogue.status = CatalogueStatus.INACTIVE;
		catalogue.isPublic = false;

		return catalogue.save();
	}

	async incrementViewCount(id: string): Promise<Catalogue> {
		const catalogue = (await this.findById(id)) as CatalogueDocument;
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		catalogue.viewCount += 1;
		return catalogue.save();
	}

	async updateRating(
		id: string,
		rating: number,
	): Promise<Catalogue> {
		const catalogue = (await this.findById(id)) as CatalogueDocument;
		if (!catalogue) {
			throw new NotFoundException('Catalogue not found');
		}

		const totalRating = catalogue.rating * catalogue.reviewCount;
		catalogue.reviewCount += 1;
		catalogue.rating = (totalRating + rating) / catalogue.reviewCount;

		return catalogue.save();
	}
}
