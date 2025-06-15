'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { type FC, useCallback } from 'react';
import z from 'zod';
import { useLogin } from '@/api-utils/hooks/auth.hooks';
import { Button } from '@/components/ui/button';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';

const schema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormSchema = typeof schema;

const LoginForm: FC = () => {
	const router = useRouter();
	const { mutate: login, isPending: isLoading } = useLogin();

	const handleSubmit = useCallback<SubmitHandler<z.infer<FormSchema>>>((values) => {
		login(values, {
			onSuccess: () => {
				router.push('/');
			},
		});
	}, [login, router]);

	return (
		<ManagedForm<FormSchema>
			schema={schema}
			onSubmit={handleSubmit}
			className="space-y-6"
			disabled={isLoading}
		>
			<ManagedFormInput<FormSchema>
				type="string"
				name="email"
				label="Email"
				inputProps={{
					type: 'email',
					autoComplete: 'email',
				}}
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="password"
				label="Password"
				inputProps={{
					type: 'password',
					autoComplete: 'current-password',
				}}
			/>
			<Button type="submit" loading={isLoading}>
				Sign in
			</Button>
		</ManagedForm>
	);
};

export default LoginForm;
