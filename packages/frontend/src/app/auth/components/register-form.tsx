'use client';

import type { SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC, useCallback, useState } from 'react';
import { z } from 'zod';
import { useRegister } from '@/api-utils/hooks/auth.hooks';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
	const [termsAccepted, setTermsAccepted] = useState(false);

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
			<div className="flex  gap-3 rounded-md bg-primary/10 border border-primary/20 p-4">
				<Checkbox
					id="termsAccepted"
					checked={termsAccepted}
					onCheckedChange={checked => setTermsAccepted(checked === true)}
					className="border-primary bg-primary/20"
				/>
				<Label htmlFor="termsAccepted" className="inline-block">
					By registering with OneYaad you acknowledge and accept our
					{' '}
					<Button variant="link" className="p-0">
						<Link href="/terms">Terms of Service</Link>
					</Button>
					{' '}
					and
					{' '}
					<Button variant="link" className="p-0">
						<Link href="/privacy">Privacy Policy</Link>
					</Button>
				</Label>
			</div>

			<Button type="submit" loading={isLoading} disabled={!termsAccepted}>
				Submit
			</Button>
		</ManagedForm>
	);
};

export default RegisterForm;
