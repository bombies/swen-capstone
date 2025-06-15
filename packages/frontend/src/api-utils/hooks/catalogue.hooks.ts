import type {
	CreateCatalogueDto,
	UpdateCatalogueDto,
} from '../types/catalogue.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CatalogueService } from '../services/catalogue-service';

export const useCreateCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateCatalogueDto) => CatalogueService.createCatalogue(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const useGetAllCatalogues = () => {
	return useQuery({
		queryKey: ['catalogues'],
		queryFn: () => CatalogueService.getAllCatalogues(),
	});
};

export const useGetCatalogueById = (id: string) => {
	return useQuery({
		queryKey: ['catalogues', id],
		queryFn: () => CatalogueService.getCatalogueById(id),
		enabled: !!id,
	});
};

export const useGetCataloguesByMerchant = () => {
	return useQuery({
		queryKey: ['catalogues', 'merchant'],
		queryFn: () => CatalogueService.getCataloguesByMerchant(),
	});
};

export const useUpdateCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCatalogueDto }) =>
			CatalogueService.updateCatalogue(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', id] });
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const useDeleteCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => CatalogueService.deleteCatalogue(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', id] });
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const useAddProductToCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ catalogueId, productId }: { catalogueId: string; productId: string }) =>
			CatalogueService.addProductToCatalogue(catalogueId, productId),
		onSuccess: (_, { catalogueId }) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', catalogueId] });
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const useRemoveProductFromCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ catalogueId, productId }: { catalogueId: string; productId: string }) =>
			CatalogueService.removeProductFromCatalogue(catalogueId, productId),
		onSuccess: (_, { catalogueId }) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', catalogueId] });
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const usePublishCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => CatalogueService.publishCatalogue(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', id] });
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const useUnpublishCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => CatalogueService.unpublishCatalogue(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', id] });
			queryClient.invalidateQueries({ queryKey: ['catalogues'] });
		},
	});
};

export const useIncrementViewCount = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => CatalogueService.incrementViewCount(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', id] });
		},
	});
};

export const useRateCatalogue = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => CatalogueService.rateCatalogue(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['catalogues', id] });
		},
	});
};
