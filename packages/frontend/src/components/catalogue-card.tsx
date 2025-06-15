import type { Catalogue } from '@/api-utils/types/catalogue.types';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface CatalogueCardProps {
	catalogue: Catalogue;
}

export function CatalogueCard({ catalogue }: CatalogueCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="p-0">
				<div className="aspect-video w-full bg-muted" />
			</CardHeader>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold">{catalogue.name}</h3>
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm">{catalogue.rating.toFixed(1)}</span>
					</div>
				</div>
				<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
					{catalogue.description}
				</p>
				<div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
					<span>
						{catalogue.productCount}
						{' '}
						products
					</span>
					<span>
						{catalogue.viewCount}
						{' '}
						views
					</span>
				</div>
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<Button className="w-full" asChild>
					<Link href={`/catalogues/${catalogue.merchant}`}>View Catalogue</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
