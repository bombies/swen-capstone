import type { Product } from '@/api-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import Image from '@/components/ui/image';

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="overflow-hidden pt-0">
			<CardHeader className="p-0 h-96">
				<Carousel className="w-full">
					<CarouselContent>
						{product.images.length === 0
							? (
									<CarouselItem>
										<Image
											draggable={false}
											src="/placeholder.png"
											alt="Placeholder"
											fill
											objectFit="cover"
											className="rounded-t-lg w-full h-96"
										/>
									</CarouselItem>
								)
							: product.images.map((image, index) => (
									<CarouselItem key={image}>
										<Image
											draggable={false}
											src={`${process.env.NEXT_PUBLIC_CDN_URL}/products/${image}`}
											alt={`${product.name} - Image ${index + 1}`}
											fill
											objectFit="cover"
											className="rounded-t-lg w-full h-96"
										/>
									</CarouselItem>
								))}
					</CarouselContent>
					{product.images.length > 1 && (
						<>
							<CarouselPrevious className="left-2" />
							<CarouselNext className="right-2" />
						</>
					)}
				</Carousel>
			</CardHeader>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold">{product.name}</h3>
					{/* <div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm">{product.rating.toFixed(1)}</span>
					</div> */}
				</div>
				<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
					{product.description}
				</p>
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<Button className="w-full" asChild>
					<Link href={`/merchants/${product.merchant}/${product._id}`}>View Product</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
