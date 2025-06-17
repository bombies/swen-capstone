'use client';

import type { SubmitHandler } from 'react-hook-form';
import type { Address } from '@/api-utils/types/order.types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { use, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useGetCartById, useRemoveItemFromCart, useUpdateCart } from '@/api-utils/hooks/cart.hooks';
import { PayPalCheckoutButton } from '@/components/payment/paypal-checkout-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from '@/components/ui/image';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';

const addressSchema = z.object({
	street: z.string().min(1, 'Street is required'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	country: z.string().min(1, 'Country is required'),
	zipCode: z.string().min(1, 'Zip code is required'),
});

type AddressFormSchema = typeof addressSchema;

export default function CartPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const { data: cart, isLoading } = useGetCartById(resolvedParams.id);
	const { mutate: removeItem } = useRemoveItemFromCart();
	const { mutate: updateCart } = useUpdateCart();
	const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

	const handleAddressSubmit = useCallback<SubmitHandler<z.infer<AddressFormSchema>>>((values) => {
		setShippingAddress(values);
	}, []);

	const handleQuantityChange = useCallback((product: string, merchant: string, newQuantity: number) => {
		if (newQuantity < 1) return;

		updateCart(
			{
				id: resolvedParams.id,
				data: {
					items: cart?.items.map(item =>
						item.product._id === product && item.merchant === merchant
							? { ...item, product: item.product._id, quantity: newQuantity }
							: { ...item, product: item.product._id },
					) ?? [],
				},
			},
			{
				onSuccess: () => {
					toast.success('Cart updated');
				},
				onError: () => {
					toast.error('Failed to update cart');
				},
			},
		);
	}, [cart?.items, resolvedParams.id, updateCart]);

	const handleRemoveItem = useCallback((product: string, merchant: string) => {
		removeItem(
			{
				id: resolvedParams.id,
				product,
				merchant,
			},
			{
				onSuccess: () => {
					toast.success('Item removed from cart');
				},
				onError: () => {
					toast.error('Failed to remove item');
				},
			},
		);
	}, [removeItem, resolvedParams.id]);

	if (isLoading || !cart) {
		return <div>Loading...</div>;
	}

	return (
		<main className="container py-8">
			<div className="grid gap-8 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Cart Items</CardTitle>
						<CardDescription>Review your cart items before checkout</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{cart.items.map(item => (
								<div key={`${item.product._id}-${item.merchant}`} className="flex items-center gap-4">
									<Image
										src={`${process.env.NEXT_PUBLIC_CDN_URL}/products/${item.product.images[0]}`}
										alt={item.product.name}
										width={100}
										height={100}
										className="rounded-lg object-cover"
									/>
									<div className="flex-1">
										<h3 className="font-semibold">{item.product.name}</h3>
										<p className="text-sm text-muted-foreground">
											{item.product.description}
										</p>
										<div className="mt-2 flex items-center gap-2">
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleQuantityChange(item.product._id, item.merchant, item.quantity - 1)}
											>
												<Minus className="h-4 w-4" />
											</Button>
											<span>{item.quantity}</span>
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleQuantityChange(item.product._id, item.merchant, item.quantity + 1)}
											>
												<Plus className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleRemoveItem(item.product._id, item.merchant)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold">
											$
											{(item.price * item.quantity).toFixed(2)}
										</p>
										<p className="text-sm text-muted-foreground">
											$
											{item.price.toFixed(2)}
											{' '}
											each
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Shipping Address Form */}
				{!shippingAddress && (
					<Card>
						<CardHeader>
							<CardTitle>Shipping Address</CardTitle>
							<CardDescription>Please provide your shipping address to proceed with checkout.</CardDescription>
						</CardHeader>
						<CardContent>
							<ManagedForm<AddressFormSchema>
								schema={addressSchema}
								onSubmit={handleAddressSubmit}
								className="space-y-4"
							>
								<ManagedFormInput<AddressFormSchema>
									type="string"
									name="street"
									label="Street Address"
								/>
								<div className="grid grid-cols-2 gap-4">
									<ManagedFormInput<AddressFormSchema>
										type="string"
										name="city"
										label="City"
									/>
									<ManagedFormInput<AddressFormSchema>
										type="string"
										name="state"
										label="State"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<ManagedFormInput<AddressFormSchema>
										type="string"
										name="country"
										label="Country"
									/>
									<ManagedFormInput<AddressFormSchema>
										type="string"
										name="zipCode"
										label="Zip Code"
									/>
								</div>
								<Button type="submit">Continue to Payment</Button>
							</ManagedForm>
						</CardContent>
					</Card>
				)}

				{/* Payment Section */}
				{shippingAddress && cart && (
					<Card>
						<CardHeader>
							<CardTitle>Payment</CardTitle>
							<CardDescription>Complete your purchase using PayPal.</CardDescription>
						</CardHeader>
						<CardContent>
							<PayPalCheckoutButton
								cart={cart}
								shippingAddress={shippingAddress}
								disabled={isLoading}
							/>
						</CardContent>
					</Card>
				)}
			</div>
		</main>
	);
}
