import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BecomeMerchantDto {
	@ApiProperty({
		description: 'The name of the company',
		example: 'Acme Corporation',
		minLength: 2,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	companyName: string;

	@ApiProperty({
		description: 'The physical address of the company',
		example: '123 Main Street, Kingston, Jamaica',
		minLength: 5,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	companyAddress: string;

	@ApiProperty({
		description: 'The contact phone number of the company',
		example: '+1 (876) 555-0123',
		minLength: 10,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	companyPhone: string;
}
