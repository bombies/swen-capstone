import type { User } from './user.types';

export interface Merchant {
	_id: string;
	user: User;
	companyName: string;
	companyAddress: string;
	companyPhone: string;
	isCompliant: boolean;
	verificationExpiresAt?: string;
	lettersOfGoodStanding: string[];
	latestLetter?: string;
	createdAt: string;
	updatedAt: string;
}

export interface BecomeMerchantDto {
	companyName: string;
	companyAddress: string;
	companyPhone: string;
	letterOfGoodStanding: string;
}
