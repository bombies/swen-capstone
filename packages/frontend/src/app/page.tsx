'use client';

import type { Catalogue } from '@/api-utils/types/catalogue.types';
import Link from 'next/link';
import { useGetAllCatalogues } from '@/api-utils/hooks/catalogue.hooks';
import { CatalogueCard } from '@/components/catalogue-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
	const { data: catalogues, isLoading } = useGetAllCatalogues();
	const { user: { data: userData, isLoading: userDataLoading } } = useAuth();

	return (
		<main className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="container py-24 text-center">
				<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
					Jamaica&apos;s Digital Marketplace
				</h1>
				<p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
					Connect with local businesses, discover unique products, and support Jamaican entrepreneurs.
				</p>
				<div className="mt-8 flex justify-center gap-4">
					<Button size="lg" asChild>
						<Link href="/catalogues">Browse Catalogues</Link>
					</Button>
					{!userDataLoading && !userData?.roles.includes('merchant') && (
						<Button size="lg" variant="outline" asChild>
							<Link href="/become-merchant">Become a Seller</Link>
						</Button>
					)}
				</div>
			</section>

			{/* Featured Catalogues */}
			<section className="container p-12">
				<h2 className="text-3xl font-bold tracking-tight">Featured Catalogues</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{isLoading
						? <div>Loading catalogues...</div>
						: catalogues?.map((catalogue: Catalogue) => (
								<CatalogueCard
									key={catalogue.merchant}
									catalogue={catalogue}
								/>
							))}
				</div>
			</section>

			{/* Popular Products */}
			<section className="container p-12">
				<h2 className="text-3xl font-bold tracking-tight">Popular Products</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{/* Product Cards will be added here */}
				</div>
			</section>
		</main>
	);
}
