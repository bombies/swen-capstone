'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="grid gap-6 text-center">
			<div className="grid gap-2">
				<h2 className="text-2xl font-semibold tracking-tight">
					Something went wrong!
				</h2>
				<p className="text-sm text-muted-foreground">
					{error.message || 'An error occurred while loading the login page.'}
				</p>
			</div>
			<Button
				onClick={() => reset()}
				variant="outline"
			>
				Try again
			</Button>
		</div>
	);
}
