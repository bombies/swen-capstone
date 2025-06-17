import type {
	CreateProductDto,
	UpdateProductDto,
} from '../types/product.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSingleMediaUploader } from '@/hooks/media-upload-hooks';
import { ProductService } from '../services/product-service';
import { useGetUploadUrl } from './s3.hooks';

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProductDto) => ProductService.createProduct(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useGetAllProducts = () => {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => ProductService.getAllProducts(),
	});
};

export const useGetProductById = (id: string) => {
	return useQuery({
		queryKey: ['products', id],
		queryFn: () => ProductService.getProductById(id),
		enabled: !!id,
	});
};

export const useSearchProducts = (query: string) => {
	return useQuery({
		queryKey: ['products', 'search', query],
		queryFn: () => ProductService.searchProducts(query),
		enabled: !!query,
	});
};

export const useGetProductsByCategory = (category: string) => {
	return useQuery({
		queryKey: ['products', 'category', category],
		queryFn: () => ProductService.getProductsByCategory(category),
		enabled: !!category,
	});
};

export const useGetProductsByMerchant = (merchantId: string) => {
	return useQuery({
		queryKey: ['products', 'merchant', merchantId],
		queryFn: () => ProductService.getProductsByMerchant(merchantId),
		enabled: !!merchantId,
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
			ProductService.updateProduct(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['products', id] });
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => ProductService.deleteProduct(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['products', id] });
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useProductImageUpload = () => {
	const { mutateAsync: fetchUrl } = useGetUploadUrl();
	return useSingleMediaUploader<string, Error, { fileExtension: string; objectKey: string }>(
		async ({ fileExtension, objectKey }) => {
			return fetchUrl({
				filename: `${objectKey}.${fileExtension}`,
				fileType: 'product-image',
				objectId: objectKey,
			});
		},
	);
};
