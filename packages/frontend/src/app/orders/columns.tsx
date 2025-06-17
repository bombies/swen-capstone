'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@/api-utils/types/order.types';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: '_id',
		header: 'Order ID',
		cell: ({ row }) => {
			const id = row.getValue('_id') as string;
			return (
				<div className="font-medium">
					{id.slice(0, 8)}
					...
				</div>
			);
		},
	},
	{
		accessorKey: 'totalAmount',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Amount
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue('totalAmount'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as string;
			return (
				<Badge
					variant={
						status === 'DELIVERED'
							? 'success'
							: status === 'CANCELLED'
								? 'destructive'
								: status === 'PROCESSING'
									? 'default'
									: 'default'
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'paymentStatus',
		header: 'Payment',
		cell: ({ row }) => {
			const status = row.getValue('paymentStatus') as string;
			return (
				<Badge
					variant={
						status === 'COMPLETED'
							? 'success'
							: status === 'FAILED'
								? 'destructive'
								: 'default'
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
		cell: ({ row }) => {
			const date = new Date(row.getValue('createdAt'));
			return <div>{format(date, 'MMM d, yyyy')}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const order = row.original;

			return (
				<Button
					variant="ghost"
					asChild
				>
					<Link href={`/orders/${order._id}`}>
						View Details
					</Link>
				</Button>
			);
		},
	},
];
