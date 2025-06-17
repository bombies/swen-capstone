'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMyMerchantProfile } from '@/api-utils/hooks/merchant.hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BecomeMerchantForm from './components/become-merchant-form';

export default function BecomeMerchantPage() {
	const router = useRouter();
	const { data: merchantProfile, isLoading } = useMyMerchantProfile();

	useEffect(() => {
		if (!isLoading && merchantProfile) {
			router.push('/');
		}
	}, [merchantProfile, isLoading, router]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="container flex min-h-screen items-center justify-center py-8">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle>Become a Merchant</CardTitle>
					<CardDescription>
						Fill out the form below to start selling on our marketplace
					</CardDescription>
				</CardHeader>
				<CardContent>
					<BecomeMerchantForm />
				</CardContent>
			</Card>
		</div>
	);
}
