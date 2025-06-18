'use client';

import Link from 'next/link';
import { useGetCatalogueProducts } from '@/api-utils/hooks/catalogue.hooks';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export default function Home() {
	const { data: catalogueProducts, isLoading } = useGetCatalogueProducts();
	const { user: userData, isLoading: userDataLoading } = useAuth();

	return (
		<main className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className={cn(
				'py-24 text-center bg-secondary w-full',
				'bg-gradient-to-br to-primary from-lime-700',
				'bg-[length:200%_200%]',
				'hover:bg-[position:100%_100%]',
				'transition-all duration-1000 ease-in-out',
			)}
			>
				<h1 className="text-4xl text-secondary-foreground font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
					Jamaica&apos;s Digital Marketplace
				</h1>
				<p className="mx-auto mt-4 max-w-[700px] text-muted md:text-xl">
					Connect with local businesses, discover unique products, and support Jamaican entrepreneurs.
				</p>
				<div className="mt-8 flex justify-center gap-4">
					<Button variant="outline" size="lg" asChild>
						<Link href="#catalogue">Browse Product Catalogue</Link>
					</Button>
					{!userDataLoading && !userData?.roles.includes('merchant') && (
						<Button size="lg" variant="outline" asChild>
							<Link href="/become-merchant">Become a Seller</Link>
						</Button>
					)}
				</div>
			</section>

			{/* Featured Products */}
			<section id="catalogue" className="p-12">
				<h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{isLoading
						? <div>Loading products...</div>
						: catalogueProducts?.map(product => (
								<ProductCard
									key={product._id}
									product={product}
								/>
							))}
				</div>
			</section>
		</main>
	);
}
