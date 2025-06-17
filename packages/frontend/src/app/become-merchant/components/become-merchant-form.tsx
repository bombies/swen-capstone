'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { type FC, useCallback } from 'react';
import { z } from 'zod';
import { useBecomeMerchant } from '@/api-utils/hooks/merchant.hooks';
import { Button } from '@/components/ui/button';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';

const schema = z.object({
	companyName: z.string().min(2, 'Company name must be at least 2 characters'),
	companyAddress: z.string().min(5, 'Company address must be at least 5 characters'),
	companyPhone: z.string().min(10, 'Please enter a valid phone number'),
});

type FormSchema = typeof schema;

const BecomeMerchantForm: FC = () => {
	const router = useRouter();
	const { mutate: becomeMerchant, isPending: isLoading } = useBecomeMerchant();

	const handleSubmit = useCallback<SubmitHandler<z.infer<FormSchema>>>((values) => {
		becomeMerchant(values, {
			onSuccess: () => {
				router.push('/');
			},
		});
	}, [becomeMerchant, router]);

	return (
		<ManagedForm<FormSchema>
			schema={schema}
			onSubmit={handleSubmit}
			className="space-y-6"
			disabled={isLoading}
		>
			<ManagedFormInput<FormSchema>
				type="string"
				name="companyName"
				label="Company Name"
				description="The legal name of your business"
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="companyAddress"
				label="Company Address"
				description="The physical address of your business"
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="companyPhone"
				label="Company Phone"
				description="A contact number for your business"
			/>
			<Button type="submit" loading={isLoading}>
				Become a Merchant
			</Button>
		</ManagedForm>
	);
};

export default BecomeMerchantForm;
