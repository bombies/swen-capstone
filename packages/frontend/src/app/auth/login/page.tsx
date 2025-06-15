'use client';

import type { FC } from 'react';
import Link from 'next/link';
import LoginForm from '@/app/auth/components/login-form';

const LoginPage: FC = () => {
	return (
		<div className="grid gap-6">
			<div className="grid gap-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Welcome back
				</h1>
				<p className="text-sm text-muted-foreground">
					Enter your email to sign in to your account
				</p>
			</div>
			<LoginForm />
			<div className="text-center text-sm">
				Don&apos;t have an account?
				{' '}
				<Link
					href="/auth/register"
					className="underline underline-offset-4 hover:text-primary"
				>
					Sign up
				</Link>
			</div>
		</div>
	);
};

export default LoginPage;
