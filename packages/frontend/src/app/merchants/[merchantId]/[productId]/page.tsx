'use server';

import { Suspense } from 'react';
import { ProductView } from '@/app/merchants/[merchantId]/[productId]/product-view';
import { Skeleton } from '@/components/ui/skeleton';

export default async function ProductPage({
	params,
}: {
	params: Promise<{ merchantId: string; productId: string }>;
}) {
	const awaitedParams = await params;
	return (
		<div className="container py-8">
			<Suspense
				fallback={(
					<div className="grid gap-8 md:grid-cols-2">
						<Skeleton className="aspect-square w-full rounded-lg" />
						<div className="space-y-4">
							<Skeleton className="h-8 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-12 w-full" />
						</div>
					</div>
				)}
			>
				<ProductView
					merchantId={awaitedParams.merchantId}
					productId={awaitedParams.productId}
				/>
			</Suspense>
		</div>
	);
}
