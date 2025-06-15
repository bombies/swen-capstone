'use client';

import Link from 'next/link';
import RegisterForm from '@/app/auth/components/register-form';

export default function RegisterPage() {
	return (
		<div className="grid gap-6">
			<div className="grid gap-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Create an account
				</h1>
				<p className="text-sm text-muted-foreground">
					Enter your email below to create your account
				</p>
			</div>
			<RegisterForm />
			<div className="text-center text-sm">
				Already have an account?
				{' '}
				<Link
					href="/auth/login"
					className="underline underline-offset-4 hover:text-primary"
				>
					Sign in
				</Link>
			</div>
		</div>
	);
}
