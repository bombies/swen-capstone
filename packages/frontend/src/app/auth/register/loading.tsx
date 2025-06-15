import { Skeleton } from '@/components/ui/skeleton';

export default function RegisterLoading() {
	return (
		<div className="grid gap-6">
			<div className="grid gap-2 text-center">
				<Skeleton className="h-8 w-48 mx-auto" />
				<Skeleton className="h-4 w-64 mx-auto" />
			</div>
			<div className="grid gap-4">
				<div className="grid gap-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="grid gap-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="grid gap-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-10 w-full" />
				</div>
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="text-center">
				<Skeleton className="h-4 w-48 mx-auto" />
			</div>
		</div>
	);
}
