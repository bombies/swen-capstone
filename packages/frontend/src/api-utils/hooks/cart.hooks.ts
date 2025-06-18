import type {
	CreateCartDto,
	CreateCartItemDto,
	UpdateCartDto,
} from '../types/cart.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { CartService } from '../services/cart-service';

export const useCreateCart = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateCartDto) => CartService.createCart(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['carts'] });
		},
	});
};

export const useGetAllCarts = () => {
	const auth = useAuth();
	return useQuery({
		queryKey: ['carts'],
		queryFn: () => CartService.getAllCarts(),
		enabled: auth.isAuthenticated && auth.user?.activeRole === 'customer',
	});
};

export const useGetCartById = (id: string) => {
	return useQuery({
		queryKey: ['carts', id],
		queryFn: () => CartService.getCartById(id),
		enabled: !!id,
	});
};

export const useGetCartsByCustomer = (customer: string) => {
	return useQuery({
		queryKey: ['carts', 'customer', customer],
		queryFn: () => CartService.getCartsByCustomer(customer),
		enabled: !!customer,
	});
};

export const useUpdateCart = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCartDto }) =>
			CartService.updateCart(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['carts', id] });
			queryClient.invalidateQueries({ queryKey: ['carts'] });
		},
	});
};

export const useDeleteCart = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => CartService.deleteCart(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['carts', id] });
			queryClient.invalidateQueries({ queryKey: ['carts'] });
		},
	});
};

export const useAddItemToCart = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateCartItemDto }) =>
			CartService.addItemToCart(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['carts', id] });
		},
	});
};

export const useRemoveItemFromCart = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			product,
			merchant,
		}: {
			id: string;
			product: string;
			merchant: string;
		}) => CartService.removeItemFromCart(id, product, merchant),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['carts', id] });
		},
	});
};
