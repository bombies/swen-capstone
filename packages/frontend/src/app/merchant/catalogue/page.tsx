'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetMyCatalogue } from '@/api-utils/hooks/catalogue.hooks';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMerchant } from '@/contexts/merchant-context';

export default function MerchantCataloguePage() {
	const router = useRouter();
	const { merchant, isLoading } = useMerchant();
	const { data: catalogue, isLoading: catalogueLoading } = useGetMyCatalogue();

	if (isLoading || catalogueLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!merchant) {
		router.push('/become-merchant');
		return null;
	}

	if (!catalogue) {
		return (
			<div className="container mx-auto py-8">
				<Card className="mx-auto max-w-2xl">
					<CardHeader>
						<CardTitle>No Catalogue Found</CardTitle>
						<CardDescription>
							It seems your catalogue doesn't have any products yet.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/merchant')}>
							Back to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Catalogue</h1>
					<p className="text-muted-foreground">
						Manage your product catalogue
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => router.push('/merchant/products/create')}
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Product
					</Button>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => router.push('/merchant')}>
							Back to Dashboard
						</Button>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{catalogue.map(product => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
}
