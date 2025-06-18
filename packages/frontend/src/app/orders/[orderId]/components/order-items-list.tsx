'use client';

import type { OrderItem } from '@/api-utils/types/order.types';
import { Package } from 'lucide-react';
import Image from 'next/image';
import { useGetProductById } from '@/api-utils/hooks/product.hooks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItemsListProps {
	items: OrderItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
	return (
		<div className="space-y-4">
			{items.map(item => (
				<OrderItemCard key={`${item.product}`} item={item} />
			))}
		</div>
	);
}

function OrderItemCard({ item }: { item: OrderItem }) {
	const { data: product, isLoading } = useGetProductById(item.product);

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-4">
					<div className="flex gap-4">
						<Skeleton className="h-20 w-20 flex-shrink-0" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-1/4" />
						</div>
						<div className="text-right space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-12" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!product) {
		return (
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center gap-4">
						<div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
							<Package className="h-8 w-8 text-gray-400" />
						</div>
						<div className="flex-1">
							<p className="font-medium text-gray-900">Product Not Found</p>
							<p className="text-sm text-gray-600">
								Product ID:
								{' '}
								{item.product}
							</p>
						</div>
						<div className="text-right">
							<p className="font-medium">
								$
								{item.price.toFixed(2)}
							</p>
							<p className="text-sm text-gray-600">
								Qty:
								{' '}
								{item.quantity}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex gap-4">
					{/* Product Image */}
					<div className="h-20 w-20 flex-shrink-0">
						{product.images && product.images.length > 0
							? (
									<Image
										src={`${process.env.NEXT_PUBLIC_CDN_URL}/products/${product.images[0]}`}
										alt={product.name}
										width={80}
										height={80}
										className="h-full w-full object-cover rounded-lg"
									/>
								)
							: (
									<div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
										<Package className="h-8 w-8 text-gray-400" />
									</div>
								)}
					</div>

					{/* Product Details */}
					<div className="flex-1 min-w-0">
						<h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
						<p className="text-sm text-gray-600 mt-1 line-clamp-2">
							{product.description}
						</p>
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="secondary" className="text-xs">
								{product.category}
							</Badge>
							{item.shippingAddress && (
								<Badge variant="outline" className="text-xs">
									Custom Shipping
								</Badge>
							)}
						</div>
					</div>

					{/* Price and Quantity */}
					<div className="text-right">
						<p className="font-medium text-gray-900">
							$
							{item.price.toFixed(2)}
						</p>
						<p className="text-sm text-gray-600">
							Qty:
							{item.quantity}
						</p>
						<p className="text-sm font-medium text-gray-900 mt-1">
							$
							{(item.price * item.quantity).toFixed(2)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
