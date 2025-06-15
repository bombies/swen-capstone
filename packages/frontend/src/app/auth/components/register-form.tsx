'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { type FC, useCallback } from 'react';
import { z } from 'zod';
import { useRegister } from '@/api-utils/hooks/auth.hooks';
import { Button } from '@/components/ui/button';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';

const schema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	firstName: z.string(),
	lastName: z.string(),
	eSignature: z.string().min(3, 'E-Signature must be at least 3 characters.'),
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords don\'t match',
	path: ['confirmPassword'],
});

type FormSchema = typeof schema;

const RegisterForm: FC = () => {
	const router = useRouter();
	const { mutate: register, isPending: isLoading } = useRegister();

	const handleSubmit = useCallback<SubmitHandler<z.infer<FormSchema>>>((values) => {
		const { confirmPassword, ...registerData } = values;
		register(registerData, {
			onSuccess: () => {
				router.push('/auth/login');
			},
		});
	}, [register, router]);

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
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="username"
				label="Username"
			/>
			<div className="flex gap-2">
				<ManagedFormInput<FormSchema>
					type="string"
					name="firstName"
					label="First Name"
				/>
				<ManagedFormInput<FormSchema>
					type="string"
					name="lastName"
					label="Last Name"
				/>
			</div>
			<ManagedFormInput<FormSchema>
				type="password"
				name="password"
				label="Password"
			/>
			<ManagedFormInput<FormSchema>
				type="password"
				name="confirmPassword"
				label="Confirmed Password"
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="eSignature"
				label="E-Signature"
				description='Your signature. For example "A. Green"'
			/>
			<Button type="submit" loading={isLoading}>
				Submit
			</Button>
		</ManagedForm>
	);
};

export default RegisterForm;
