import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { CatalogueStatus } from '../schemas/catalogue.schema';

export class UpdateCatalogueDto {
	@ApiProperty({
		description: 'Name of the catalogue',
		example: 'Summer Collection 2024',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		description: 'Description of the catalogue',
		example: 'Our latest summer collection featuring beach wear and accessories',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		description: 'Array of product IDs',
		example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
		type: [String],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsUUID('4', { each: true })
	products?: string[];

	@ApiProperty({
		description: 'Status of the catalogue',
		enum: CatalogueStatus,
		example: CatalogueStatus.ACTIVE,
		required: false,
	})
	@IsOptional()
	@IsEnum(CatalogueStatus)
	status?: CatalogueStatus;

	@ApiProperty({
		description: 'Whether the catalogue is public',
		example: true,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	isPublic?: boolean;

	@ApiProperty({
		description: 'Date when the catalogue was published',
		example: '2024-03-15T00:00:00.000Z',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	publishedAt?: Date;

	@ApiProperty({
		description: 'Date when the catalogue expires',
		example: '2024-09-15T00:00:00.000Z',
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	expiresAt?: Date;

	@ApiProperty({
		description: 'Array of tags',
		example: ['summer', 'beach', 'accessories'],
		type: [String],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];

	@IsOptional()
	@IsBoolean()
	isFeatured?: boolean;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	featuredAt?: Date;
}
