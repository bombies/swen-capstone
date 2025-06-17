'use client';

import { Edit, Eye, Package, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetMyCatalogue, usePublishCatalogue, useUnpublishCatalogue } from '@/api-utils/hooks/catalogue.hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMerchant } from '@/contexts/merchant-context';

export default function MerchantCataloguePage() {
	const router = useRouter();
	const { merchant, isLoading } = useMerchant();
	const { data: catalogue, isLoading: catalogueLoading } = useGetMyCatalogue();
	const publishCatalogue = usePublishCatalogue();
	const unpublishCatalogue = useUnpublishCatalogue();

	if (isLoading || catalogueLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!merchant) {
		router.push('/become-merchant');
		return null;
	}

	if (!catalogue) {
		return (
			<div className="container mx-auto py-8">
				<Card className="mx-auto max-w-2xl">
					<CardHeader>
						<CardTitle>No Catalogue Found</CardTitle>
						<CardDescription>
							It seems your catalogue hasn't been created yet. This should happen automatically when you become a merchant.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/merchant')}>
							Back to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handlePublish = () => {
		if (catalogue._id) {
			publishCatalogue.mutate(catalogue._id);
		}
	};

	const handleUnpublish = () => {
		if (catalogue._id) {
			unpublishCatalogue.mutate(catalogue._id);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Catalogue</h1>
					<p className="text-muted-foreground">
						Manage your product catalogue
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => router.push('/merchant/products/create')}
						className="flex items-center gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Product
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<Package className="h-5 w-5" />
										{catalogue.name}
									</CardTitle>
									<CardDescription>
										{catalogue.description || 'No description provided'}
									</CardDescription>
								</div>
								<Badge variant={catalogue.status === 'active' ? 'default' : 'secondary'}>
									{catalogue.status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium">Products:</span>
										{' '}
										{catalogue.productCount}
									</div>
									<div>
										<span className="font-medium">Views:</span>
										{' '}
										{catalogue.viewCount}
									</div>
									<div>
										<span className="font-medium">Rating:</span>
										{' '}
										{catalogue.rating.toFixed(1)}
										/5
									</div>
									<div>
										<span className="font-medium">Reviews:</span>
										{' '}
										{catalogue.reviewCount}
									</div>
								</div>

								{catalogue.tags && catalogue.tags.length > 0 && (
									<div>
										<span className="text-sm font-medium">Tags:</span>
										<div className="mt-1 flex flex-wrap gap-1">
											{catalogue.tags.map(tag => (
												<Badge key={tag} variant="outline" className="text-xs">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								)}

								<Separator />

								<div className="flex gap-2">
									{catalogue.status === 'active'
										? (
												<Button
													onClick={handleUnpublish}
													variant="outline"
													disabled={unpublishCatalogue.isPending}
												>
													<Edit className="mr-2 h-4 w-4" />
													Unpublish
												</Button>
											)
										: (
												<Button
													onClick={handlePublish}
													disabled={publishCatalogue.isPending}
												>
													<Eye className="mr-2 h-4 w-4" />
													Publish
												</Button>
											)}
									<Button variant="outline" onClick={() => router.push('/merchant')}>
										Back to Dashboard
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div>
					<Card>
						<CardHeader>
							<CardTitle>Catalogue Stats</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Status</span>
								<Badge variant={catalogue.isPublic ? 'default' : 'secondary'}>
									{catalogue.isPublic ? 'Public' : 'Private'}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Created</span>
								<span className="text-sm text-muted-foreground">
									{new Date(catalogue.createdAt).toLocaleDateString()}
								</span>
							</div>
							{catalogue.publishedAt && (
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Published</span>
									<span className="text-sm text-muted-foreground">
										{new Date(catalogue.publishedAt).toLocaleDateString()}
									</span>
								</div>
							)}
							{catalogue.featuredAt && (
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Featured</span>
									<span className="text-sm text-muted-foreground">
										{new Date(catalogue.featuredAt).toLocaleDateString()}
									</span>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
