'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { z } from 'zod';
import { useAddProductToCatalogue, useGetMyCatalogue } from '@/api-utils/hooks/catalogue.hooks';
import { useCreateProduct } from '@/api-utils/hooks/product.hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';
import { useMerchant } from '@/contexts/merchant-context';

const schema = z.object({
	name: z.string().min(2, 'Product name must be at least 2 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	price: z.number().min(0, 'Price must be positive'),
	category: z.string().min(1, 'Category is required'),
	stock: z.number().min(0, 'Stock must be non-negative').max(100, 'Stock cannot exceed 100'),
});

type FormSchema = typeof schema;

export default function CreateProductPage() {
	const router = useRouter();
	const { merchant } = useMerchant();
	const { data: catalogue } = useGetMyCatalogue();
	const { mutate: createProduct, isPending: isLoading } = useCreateProduct();
	const { mutate: addToCatalogue, isPending: isAddingToCatalogue } = useAddProductToCatalogue();

	const handleSubmit = useCallback<SubmitHandler<z.infer<FormSchema>>>((values) => {
		if (!merchant) return;

		createProduct({
			...values,
			merchantId: merchant.id,
			// TODO: Handle images
			images: [],
		}, {
			onSuccess: (newProduct) => {
				// Add the new product to the catalogue
				if (catalogue?._id && newProduct.id) {
					addToCatalogue({
						catalogueId: catalogue._id,
						productId: newProduct.id,
					}, {
						onSuccess: () => {
							router.push('/merchant');
						},
					});
				} else {
					router.push('/merchant');
				}
			},
		});
	}, [createProduct, merchant, catalogue, addToCatalogue, router]);

	const isSubmitting = isLoading || isAddingToCatalogue;

	return (
		<div className="container mx-auto py-8">
			<Card className="mx-auto max-w-2xl">
				<CardHeader>
					<CardTitle>Create New Product</CardTitle>
					<CardDescription>
						Add a new product to your catalogue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ManagedForm<FormSchema>
						schema={schema}
						onSubmit={handleSubmit}
						className="space-y-6"
						disabled={isSubmitting}
					>
						<ManagedFormInput<FormSchema>
							type="string"
							name="name"
							label="Product Name"
							description="The name of your product"
						/>
						<ManagedFormInput<FormSchema>
							type="string"
							name="description"
							label="Description"
							description="Detailed description of your product"
						/>
						<ManagedFormInput<FormSchema>
							name="price"
							label="Price"
							description="Price in Jamaican dollars"
							inputProps={{
								type: 'number',
								step: 0.01,
								min: 0,
							}}
						/>
						<ManagedFormInput<FormSchema>
							type="string"
							name="category"
							label="Category"
							description="Product category"
						/>
						<ManagedFormInput<FormSchema>
							name="stock"
							label="Stock"
							description="Available quantity (max 100)"
							inputProps={{
								type: 'number',
								min: 0,
								max: 100,
							}}
						/>
						<div className="flex gap-4">
							<Button type="submit" loading={isSubmitting}>
								Create Product
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</div>
					</ManagedForm>
				</CardContent>
			</Card>
		</div>
	);
}
