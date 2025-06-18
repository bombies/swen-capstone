'use client';

import type { Order } from '@/api-utils/types/order.types';
import { format } from 'date-fns';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusTimelineProps {
	order: Order;
}

const orderStatuses = [
	{ key: 'PENDING', label: 'Order Placed', icon: CheckCircle },
	{ key: 'PROCESSING', label: 'Processing', icon: Clock },
	{ key: 'SHIPPED', label: 'Shipped', icon: CheckCircle },
	{ key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export default function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
	const getStatusIndex = (status: string) => {
		return orderStatuses.findIndex(s => s.key === status);
	};

	const currentStatusIndex = getStatusIndex(order.status);
	const isCancelled = order.status === 'CANCELLED';
	const isRefunded = order.status === 'REFUNDED';

	return (
		<div className="space-y-4">
			{/* Main Timeline */}
			<div className="relative">
				{/* Timeline Line */}
				<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

				{/* Timeline Items */}
				<div className="space-y-6">
					{orderStatuses.map((status, index) => {
						const Icon = status.icon;
						const isCompleted = index <= currentStatusIndex;
						const isCurrent = index === currentStatusIndex;
						const isActive = isCompleted || isCurrent;

						return (
							<div key={status.key} className="relative flex items-start gap-4">
								{/* Status Icon */}
								<div
									className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
										isActive
											? 'bg-blue-100 text-blue-600'
											: 'bg-gray-100 text-gray-400'
									}`}
								>
									<Icon className="w-6 h-6" />
								</div>

								{/* Status Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h4
											className={`font-medium ${
												isActive ? 'text-gray-900' : 'text-gray-500'
											}`}
										>
											{status.label}
										</h4>
										{isCurrent && (
											<Badge variant="secondary" className="text-xs">
												Current
											</Badge>
										)}
									</div>

									{/* Status Date */}
									{getStatusDate(order, status.key) && (
										<p className="text-sm text-gray-600 mt-1">
											{format(new Date(getStatusDate(order, status.key)!), 'MMM d, yyyy')}
										</p>
									)}

									{/* Status Description */}
									{isCurrent && (
										<p className="text-sm text-gray-600 mt-1">
											{getStatusDescription(order.status)}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Special Status Messages */}
			{(isCancelled || isRefunded) && (
				<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-start gap-3">
						<Circle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
						<div>
							<h4 className="font-medium text-red-900">
								{isCancelled ? 'Order Cancelled' : 'Order Refunded'}
							</h4>
							<p className="text-sm text-red-700 mt-1">
								{isCancelled
									? order.cancellationReason || 'Order was cancelled'
									: order.refundReason || 'Order was refunded'}
							</p>
							{getStatusDate(order, order.status) && (
								<p className="text-sm text-red-600 mt-1">
									{format(new Date(getStatusDate(order, order.status)!), 'MMM d, yyyy')}
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Notes */}
			{order.notes && (
				<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h4 className="font-medium text-blue-900 mb-2">Order Notes</h4>
					<p className="text-sm text-blue-700">{order.notes}</p>
				</div>
			)}
		</div>
	);
}

function getStatusDate(order: Order, status: string): string | null {
	switch (status) {
		case 'PENDING':
			return order.createdAt;
		case 'PROCESSING':
			return order.processedAt || null;
		case 'SHIPPED':
			return order.trackingNumber ? order.updatedAt : null;
		case 'DELIVERED':
			return order.completedAt || null;
		case 'CANCELLED':
			return order.cancelledAt || null;
		case 'REFUNDED':
			return order.refundedAt || null;
		default:
			return null;
	}
}

function getStatusDescription(status: string): string {
	switch (status) {
		case 'PENDING':
			return 'Your order has been placed and is awaiting confirmation.';
		case 'PROCESSING':
			return 'Your order is being prepared for shipment.';
		case 'SHIPPED':
			return 'Your order has been shipped and is on its way.';
		case 'DELIVERED':
			return 'Your order has been successfully delivered.';
		case 'CANCELLED':
			return 'Your order has been cancelled.';
		case 'REFUNDED':
			return 'Your order has been refunded.';
		default:
			return 'Your order is being processed.';
	}
}
