'use client';

import { format } from 'date-fns';
import { ArrowLeft, Clock, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GCT } from '@/api-utils';
import { useGetOrderById } from '@/api-utils/hooks/order.hooks';
import OrderStatusTimeline from '@/app/orders/[orderId]/components/order-status-timeline';
import PaymentDetails from '@/app/orders/[orderId]/components/payment-details';
import ShippingDetails from '@/app/orders/[orderId]/components/shipping-details';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import OrderItemsList from './components/order-items-list';

export default function OrderDetailsPage() {
	const params = useParams();
	const orderId = params.orderId as string;
	const { data: order, isLoading, error } = useGetOrderById(orderId);

	if (isLoading) {
		return <OrderDetailsSkeleton />;
	}

	if (error || !order) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
							<p className="text-gray-600 mb-6">
								The order you're looking for doesn't exist or you don't have permission to view it.
							</p>
							<Button asChild>
								<Link href="/orders">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back to Orders
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'DELIVERED':
				return 'bg-green-100 text-green-800';
			case 'SHIPPED':
				return 'bg-blue-100 text-blue-800';
			case 'PROCESSING':
				return 'bg-yellow-100 text-yellow-800';
			case 'PENDING':
				return 'bg-gray-100 text-gray-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			case 'REFUNDED':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

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
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			{/* Header */}
			<div className="mb-6">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/orders">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Orders
					</Link>
				</Button>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Order #
							{order._id.slice(-8)}
						</h1>
						<p className="text-gray-600 mt-1">
							Placed on
							{' '}
							{format(new Date(order.createdAt), 'MMMM d, yyyy')}
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
						<Badge className={getStatusColor(order.status)}>
							<Package className="mr-1 h-3 w-3" />
							{order.status}
						</Badge>
						<Badge className={getPaymentStatusColor(order.paymentStatus)}>
							<CreditCard className="mr-1 h-3 w-3" />
							{order.paymentStatus}
						</Badge>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content - 2/3 width */}
				<div className="lg:col-span-2 space-y-6">
					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Package className="mr-2 h-5 w-5" />
								Order Items (
								{order.totalItems}
								)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<OrderItemsList items={order.items} />
						</CardContent>
					</Card>

					{/* Order Status Timeline */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<Clock className="mr-2 h-5 w-5" />
								Order Timeline
							</CardTitle>
						</CardHeader>
						<CardContent>
							<OrderStatusTimeline order={order} />
						</CardContent>
					</Card>
				</div>

				{/* Sidebar - 1/3 width */}
				<div className="space-y-6">
					{/* Order Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between">
								<span className="text-gray-600">
									Items (
									{order.totalItems}
									):
								</span>
								<span className="font-medium">
									$
									{(order.totalAmount - (order.totalAmount * GCT)).toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Shipping:</span>
								<span className="font-medium">$0.00</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Tax:</span>
								<span className="font-medium">
									$
									{(order.totalAmount * GCT).toFixed(2)}
								</span>
							</div>
							<Separator />
							<div className="flex justify-between text-lg font-bold">
								<span>Total:</span>
								<span>
									$
									{order.totalAmount.toFixed(2)}
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Shipping Details */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<MapPin className="mr-2 h-5 w-5" />
								Shipping Address
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ShippingDetails address={order.shippingAddress} />
						</CardContent>
					</Card>

					{/* Payment Details */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<CreditCard className="mr-2 h-5 w-5" />
								Payment Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<PaymentDetails order={order} />
						</CardContent>
					</Card>

					{/* Tracking Information */}
					{order.trackingNumber && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Truck className="mr-2 h-5 w-5" />
									Tracking Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div>
										<span className="text-sm text-gray-600">Tracking Number:</span>
										<p className="font-mono text-sm">{order.trackingNumber}</p>
									</div>
									{order.estimatedDeliveryDate && (
										<div>
											<span className="text-sm text-gray-600">Estimated Delivery:</span>
											<p className="text-sm">
												{format(new Date(order.estimatedDeliveryDate), 'MMMM d, yyyy')}
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

function OrderDetailsSkeleton() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-6">
				<Skeleton className="h-10 w-32 mb-4" />
				<Skeleton className="h-8 w-64 mb-2" />
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[1, 2, 3].map(i => (
									<div key={i} className="flex gap-4">
										<Skeleton className="h-20 w-20" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-4 w-1/2" />
											<Skeleton className="h-4 w-1/4" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[1, 2, 3, 4].map(i => (
									<Skeleton key={i} className="h-4 w-full" />
								))}
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="space-y-6">
					{[1, 2, 3, 4].map(i => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-6 w-32" />
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{[1, 2, 3].map(j => (
										<Skeleton key={j} className="h-4 w-full" />
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
