'use client';

import { DollarSign, Package, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGetMyCatalogue } from '@/api-utils/hooks/catalogue.hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMerchant } from '@/contexts/merchant-context';

export default function MerchantDashboard() {
	const router = useRouter();
	const { merchant, isLoading } = useMerchant();
	const { data: catalogue } = useGetMyCatalogue();

	useEffect(() => {
		if (!isLoading && !merchant) {
			router.push('/become-merchant');
		}
	}, [merchant, isLoading, router]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!merchant) {
		return null;
	}

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Merchant Dashboard</h1>
				<p className="text-muted-foreground">
					Welcome back,
					{' '}
					{merchant.companyName}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Products</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{catalogue?.length || 0}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Customers</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$0.00</div>
					</CardContent>
				</Card>
			</div>

			<div className="mt-8 grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>
							Common tasks for managing your business
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button
							onClick={() => router.push('/merchant/products/create')}
							className="w-full justify-start"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Product
						</Button>
						<Button
							onClick={() => router.push('/merchant/catalogue')}
							variant="outline"
							className="w-full justify-start"
						>
							<Package className="mr-2 h-4 w-4" />
							View Catalogue
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Latest updates from your business
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							No recent activity to display
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
