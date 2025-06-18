'use client';

import type { Order } from '@/api-utils/types/order.types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface PaymentDetailsProps {
	order: Order;
}

export default function PaymentDetails({ order }: PaymentDetailsProps) {
	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case 'COMPLETED':
				return 'bg-green-100 text-green-800';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'FAILED':
				return 'bg-red-100 text-red-800';
			case 'REFUNDED':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-600">Payment Status:</span>
				<Badge className={getPaymentStatusColor(order.paymentStatus)}>
					{order.paymentStatus}
				</Badge>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-600">Total Amount:</span>
				<span className="font-medium">
					$
					{order.totalAmount.toFixed(2)}
				</span>
			</div>

			{order.payment && (
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Payment ID:</span>
					<span className="font-mono text-sm">{order.payment}</span>
				</div>
			)}

			<div className="flex items-center justify-between">
				<span className="text-sm text-gray-600">Order Date:</span>
				<span className="text-sm">
					{format(new Date(order.createdAt), 'MMM d, yyyy')}
				</span>
			</div>

			{order.updatedAt !== order.createdAt && (
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Last Updated:</span>
					<span className="text-sm">
						{format(new Date(order.updatedAt), 'MMM d, yyyy')}
					</span>
				</div>
			)}
		</div>
	);
}
