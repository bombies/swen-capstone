'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { useCreateProduct } from '@/api-utils/hooks/product.hooks';
import { useProductImageUpload } from '@/api-utils/hooks/product.hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MegaBytes } from '@/components/ui/file-upload/file-size';
import FileUpload from '@/components/ui/file-upload/file-upload';
import MediaType from '@/components/ui/file-upload/media-type';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';
import { useMerchant } from '@/contexts/merchant-context';

const schema = z.object({
	name: z.string().min(2, 'Product name must be at least 2 characters'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	price: z.string().transform(Number),
	category: z.string().min(1, 'Category is required'),
	stock: z.string().transform(Number),
});

type FormSchema = typeof schema;

export default function CreateProductPage() {
	const router = useRouter();
	const { merchant } = useMerchant();
	const { mutate: createProduct, isPending: isLoading } = useCreateProduct();
	const { uploadJob, isUploading, currentProgress } = useProductImageUpload();
	const [images, setImages] = useState<string[]>([]);

	const handleSubmit = useCallback<SubmitHandler<z.infer<FormSchema>>>((values) => {
		if (!merchant) return;

		createProduct({
			...values,
			merchant: merchant._id,
			images,
		}, {
			onSuccess: () => {
				router.push('/merchant');
			},
		});
	}, [createProduct, merchant, router, images]);

	const handleImageUpload = useCallback(async (files: File[]) => {
		let success = true;
		for (const file of files) {
			try {
				const extension = file?.name.split('.').pop();
				if (!extension) throw new Error('Invalid file extension');

				const objectKey = crypto.randomUUID();

				const imageKey = await uploadJob(file, {
					fileExtension: extension,
					objectKey,
				});

				setImages(prev => [...prev, imageKey]);
			} catch (error) {
				console.error('Failed to upload image:', error);
				success = false;
			}
		}

		return success;
	}, [uploadJob]);

	const isSubmitting = isLoading || isUploading;

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
						showRequiredAsterisk
					>
						<ManagedFormInput<FormSchema>
							type="string"
							name="name"
							label="Product Name"
							description="The name of your product"
							showErrorMessage
						/>
						<ManagedFormInput<FormSchema>
							type="textarea"
							name="description"
							label="Description"
							description="Detailed description of your product"
							showErrorMessage
						/>
						<ManagedFormInput<FormSchema>
							name="price"
							label="Price"
							description="Price in Jamaican dollars"
							showErrorMessage
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
							showErrorMessage
						/>
						<ManagedFormInput<FormSchema>
							name="stock"
							label="Stock"
							description="Available quantity (max 100)"
							inputProps={{
								type: 'number',
								min: 0,
							}}
							showErrorMessage
						/>
						<div className="space-y-2">
							<label className="text-sm font-medium" htmlFor="productImage">Product Images</label>
							<p className="text-sm text-muted-foreground">
								Upload images of your product (max 5MB per image)
							</p>
							<FileUpload
								type="multiple"
								maxFiles={10}
								uploadType="lazy"
								fileTypes={[MediaType.IMAGE]}
								maxFileSize={MegaBytes.from(512)}
								handleServerUpload={handleImageUpload}
								isUploading={isUploading}
								serverUploadProgress={currentProgress}
								showToast
								toastOptions={{
									uploadingMsg: 'Uploading image...',
									successMsg: 'Image uploaded successfully',
									errorHandler: error => `Failed to upload image: ${error}`,
								}}
							>
								{inputRef => (
									<Button
										type="button"
										variant="outline"
										onClick={() => inputRef.current?.click()}
										disabled={isSubmitting}
									>
										Upload Image
									</Button>
								)}
							</FileUpload>
						</div>
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
