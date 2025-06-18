import type {
	CreatePaymentDto,
	UpdatePaymentDto,
} from '../types/payment.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaymentService } from '../services/payment-service';

export const useCreatePayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePaymentDto) => PaymentService.createPayment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payments'] });
		},
	});
};

export const useGetAllPayments = () => {
	return useQuery({
		queryKey: ['payments'],
		queryFn: () => PaymentService.getAllPayments(),
	});
};

export const useGetPaymentById = (id: string) => {
	return useQuery({
		queryKey: ['payments', id],
		queryFn: () => PaymentService.getPaymentById(id),
		enabled: !!id,
	});
};

export const useGetPaymentByOrder = (orderId: string) => {
	return useQuery({
		queryKey: ['payments', 'order', orderId],
		queryFn: () => PaymentService.getPaymentByOrder(orderId),
		enabled: !!orderId,
	});
};

export const useGetCustomerPayments = () => {
	return useQuery({
		queryKey: ['payments', 'customer'],
		queryFn: () => PaymentService.getCustomerPayments(),
	});
};

export const useGetMerchantPayments = () => {
	return useQuery({
		queryKey: ['payments', 'merchant'],
		queryFn: () => PaymentService.getMerchantPayments(),
	});
};

export const useGetMerchantPaymentStats = () => {
	return useQuery({
		queryKey: ['payments', 'merchant', 'stats'],
		queryFn: () => PaymentService.getMerchantPaymentStats(),
	});
};

export const useUpdatePayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) =>
			PaymentService.updatePayment(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['payments', id] });
			queryClient.invalidateQueries({ queryKey: ['payments'] });
		},
	});
};

export const useRefundPayment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => PaymentService.refundPayment(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['payments', id] });
			queryClient.invalidateQueries({ queryKey: ['payments'] });
		},
	});
};
