'use client';

import { useGetAllOrders } from '@/api-utils';
import { columns } from '@/app/orders/columns';
import { DataTable } from '@/app/orders/data-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersTable() {
	const { data: orders, isLoading } = useGetAllOrders();

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
			</div>
		);
	}

	return <DataTable columns={columns} data={orders || []} />;
}
