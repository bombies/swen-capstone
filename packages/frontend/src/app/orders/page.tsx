import { Suspense } from 'react';
import OrdersTable from '@/app/orders/orders-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersPage() {
	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<div>Loading...</div>}>
						<OrdersTable />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
