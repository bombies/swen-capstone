import { useQuery } from '@tanstack/react-query';
import { CatalogueService } from '../services/catalogue-service';

export const useGetCatalogueProducts = () => {
	return useQuery({
		queryKey: ['catalogues'],
		queryFn: () => CatalogueService.getCatalogueProducts(),
	});
};

export const useGetMyCatalogue = () => {
	return useQuery({
		queryKey: ['catalogues', 'me'],
		queryFn: () => CatalogueService.getMyCatalogue(),
	});
};

export const useGetCataloguesByMerchant = () => {
	return useQuery({
		queryKey: ['catalogues', 'merchant'],
		queryFn: () => CatalogueService.getCataloguesByMerchant(),
	});
};
