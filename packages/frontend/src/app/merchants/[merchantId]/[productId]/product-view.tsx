'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAddItemToCart } from '@/api-utils/hooks/cart.hooks';
import { useGetProductById } from '@/api-utils/hooks/product.hooks';
import { CartSelect } from '@/components/cart/cart-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FormLabel } from '@/components/ui/form';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import ManagedForm from '@/components/ui/managed-form/managed-form';
import ManagedFormField from '@/components/ui/managed-form/managed-form-field';
import { useAuth } from '@/hooks/use-auth';

export function ProductView({ merchantId, productId }: { merchantId: string; productId: string }) {
	const { user: { data: userData } } = useAuth();
	const { data: product, isLoading } = useGetProductById(productId);
	const { mutate: addItemToCart, isPending: isAddingToCart } = useAddItemToCart();
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedCartId, setSelectedCartId] = useState<string | null>(null);

	const schema = z.object({
		quantity: z.coerce.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
	});

	const handleAddToCart = (values: z.infer<typeof schema>) => {
		if (!userData) {
			toast.error('You must be logged in to add items to your cart.');
			return;
		}
		if (!selectedCartId) {
			toast.error('Please select a cart first.');
			return;
		}
		addItemToCart({
			id: selectedCartId,
			data: {
				product: productId,
				merchant: merchantId,
				quantity: values.quantity,
				price: product?.price || 0,
			},
		}, {
			onSuccess: () => {
				toast.success('Added to cart!');
			},
			onError: () => {
				toast.error('Failed to add to cart.');
			},
		});
	};

	if (isLoading || !product) {
		return null;
	}

	return (
		<div className="grid gap-8 md:grid-cols-2">
			<div className="space-y-4">
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
											className="rounded-lg w-full h-96"
										/>
									</CarouselItem>
								)
							: product.images.map((image: string, index: number) => (
									<CarouselItem key={image}>
										<Image
											draggable={false}
											src={`${process.env.NEXT_PUBLIC_CDN_URL}/products/${image}`}
											alt={`${product.name} - Image ${index + 1}`}
											fill
											objectFit="cover"
											className="rounded-lg w-full h-96"
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

				{product.images.length > 1 && (
					<div className="grid grid-cols-4 gap-2">
						{product.images.map((image: string, index: number) => (
							<button
								type="button"
								key={image}
								onClick={() => setSelectedImage(index)}
								className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
									selectedImage === index
										? 'border-primary'
										: 'border-transparent'
								}`}
							>
								<Image
									draggable={false}
									src={`${process.env.NEXT_PUBLIC_CDN_URL}/products/${image}`}
									alt={`${product.name} - Thumbnail ${index + 1}`}
									fill
									objectFit="cover"
									className="w-full h-full"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">{product.name}</h1>
					<p className="mt-2 text-2xl font-semibold text-primary">
						$
						{product.price.toFixed(2)}
					</p>
				</div>

				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Description</h2>
					<p className="text-muted-foreground">{product.description}</p>
				</div>

				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Stock</h2>
					<p className="text-muted-foreground">
						{product.stock > 0
							? `${product.stock} units available`
							: 'Out of stock'}
					</p>
				</div>

				<Card>
					<CardContent className="p-6">
						{userData?.activeRole === 'customer'
							? (
									<ManagedForm
										schema={schema}
										onSubmit={handleAddToCart}
										className="space-y-4"
										disabled={product?.stock === 0 || isAddingToCart}
										initialValues={{ quantity: 1 }}
									>
										<div className="space-y-4">
											<CartSelect
												onSelect={setSelectedCartId}
												disabled={product?.stock === 0 || isAddingToCart}
											/>
											<ManagedFormField
												name="quantity"
												render={({ field }) => (
													<>
														<FormLabel>
															Quantity
														</FormLabel>
														<div className="flex items-center gap-2">
															<Button
																type="button"
																variant="outline"
																size="icon"
																className="rounded-full"
																onClick={() => {
																	const newValue = Math.max(1, (field.value || 1) - 1);
																	field.onChange(newValue);
																}}
																disabled={field.value <= 1}
															>
																<Minus className="h-4 w-4" />
															</Button>
															<Input
																type="number"
																min={1}
																max={product.stock}
																className="w-20 text-center"
																{...field}
															/>
															<Button
																type="button"
																variant="outline"
																size="icon"
																className="rounded-full"
																onClick={() => {
																	const newValue = Math.min(100, (field.value || 1) + 1);
																	field.onChange(newValue);
																}}
																disabled={field.value >= product.stock}
															>
																<Plus className="h-4 w-4" />
															</Button>
														</div>
													</>
												)}
											/>
										</div>
										<Button
											type="submit"
											className="w-full"
											disabled={product?.stock === 0 || isAddingToCart || !selectedCartId}
										>
											{isAddingToCart ? 'Adding...' : 'Add to Cart'}
										</Button>
									</ManagedForm>
								)
							: (
									<>
										<p>
											You can't add this item to your cart in merchant mode.
											Switch to customer mode if you would like to add this product to one of your carts.
										</p>
									</>
								)}

					</CardContent>
				</Card>
			</div>
		</div>
	);
}
