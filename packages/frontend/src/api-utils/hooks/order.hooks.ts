import type {
	CreateOrderDto,
	UpdateOrderDto,
} from '../types/order.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services/order-service';

export const useCreateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateOrderDto) => OrderService.createOrder(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useGetAllOrders = () => {
	return useQuery({
		queryKey: ['orders'],
		queryFn: () => OrderService.getAllOrders(),
	});
};

export const useGetOrderById = (id: string) => {
	return useQuery({
		queryKey: ['orders', id],
		queryFn: () => OrderService.getOrderById(id),
		enabled: !!id,
	});
};

export const useGetOrdersByCustomer = (customerId: string) => {
	return useQuery({
		queryKey: ['orders', 'customer', customerId],
		queryFn: () => OrderService.getOrdersByCustomer(customerId),
		enabled: !!customerId,
	});
};

export const useGetOrdersByMerchant = (merchantId: string) => {
	return useQuery({
		queryKey: ['orders', 'merchant', merchantId],
		queryFn: () => OrderService.getOrdersByMerchant(merchantId),
		enabled: !!merchantId,
	});
};

export const useUpdateOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
			OrderService.updateOrder(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useCancelOrder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => OrderService.cancelOrder(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['orders', id] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};
