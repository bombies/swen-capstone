'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useGetAllCarts } from '@/api-utils/hooks/cart.hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CartsPage() {
	const { data: carts, isLoading } = useGetAllCarts();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!carts?.length) {
		return (
			<div className="container py-10">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<ShoppingCart className="h-12 w-12 text-muted-foreground" />
					<h1 className="text-2xl font-bold">No Carts Found</h1>
					<p className="text-muted-foreground">You haven't created any carts yet.</p>
					<Button asChild>
						<Link href="/">Start Shopping</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<h1 className="text-3xl font-bold mb-8">Your Carts</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{carts.map(cart => (
					<Card key={cart._id}>
						<CardHeader>
							<CardTitle>
								{cart.name}
							</CardTitle>
							<CardDescription>
								{cart.items.length}
								{' '}
								items • Created
								{' '}
								{new Date(cart.createdAt).toLocaleDateString()}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center">
								<div className="text-lg font-semibold">
									$
									{cart.items.reduce(
										(acc, item) => acc + (item.price * item.quantity),
										0,
									).toFixed(2)}
								</div>
								<Button asChild>
									<Link href={`/carts/${cart._id}`}>View Cart</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
