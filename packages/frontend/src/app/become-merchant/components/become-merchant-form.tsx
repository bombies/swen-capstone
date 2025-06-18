'use client';

import type { SubmitHandler } from 'react-hook-form';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useBecomeMerchant, useLetterOfGoodStandingUpload } from '@/api-utils/hooks/merchant.hooks';
import { Button } from '@/components/ui/button';
import { MegaBytes } from '@/components/ui/file-upload/file-size';
import FileUpload from '@/components/ui/file-upload/file-upload';
import MediaType from '@/components/ui/file-upload/media-type';
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
	const { uploadJob, isUploading, currentProgress } = useLetterOfGoodStandingUpload();
	const [letterOfGoodStanding, setLetterOfGoodStanding] = useState<string>();

	const handleSubmit = useCallback<SubmitHandler<z.infer<FormSchema>>>((values) => {
		if (!letterOfGoodStanding) {
			toast.error('Letter of Good Standing is required');
			return;
		}

		becomeMerchant({
			...values,
			letterOfGoodStanding,
		}, {
			onSuccess: () => {
				router.push('/');
			},
		});
	}, [becomeMerchant, router, letterOfGoodStanding]);

	const handleLetterUpload = useCallback(async (file: File) => {
		try {
			const letterKey = await uploadJob(file, {});
			setLetterOfGoodStanding(letterKey);
			return true;
		} catch (error) {
			console.error('Failed to upload letter:', error);
			return 'Failed to upload letter';
		}
	}, [uploadJob]);

	const isSubmitting = isLoading || isUploading;

	return (
		<ManagedForm<FormSchema>
			schema={schema}
			onSubmit={handleSubmit}
			className="space-y-6"
			disabled={isSubmitting}
		>
			<ManagedFormInput<FormSchema>
				type="string"
				name="companyName"
				label="Company Name"
				description="The legal name of your business"
				showErrorMessage
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="companyAddress"
				label="Company Address"
				description="The physical address of your business"
				showErrorMessage
			/>
			<ManagedFormInput<FormSchema>
				type="string"
				name="companyPhone"
				label="Company Phone"
				description="A contact number for your business"
				showErrorMessage
			/>
			<div className="space-y-2">
				<label htmlFor="letter-upload" className="text-sm font-medium">Letter of Good Standing</label>
				<p className="text-sm text-muted-foreground">
					Upload your Letter of Good Standing from the Companies Office of Jamaica (max 5MB)
				</p>
				{!letterOfGoodStanding
					? (
							<FileUpload
								type="single"
								fileTypes={[MediaType.JSON]}
								maxFileSize={MegaBytes.from(5)}
								handleServerUpload={handleLetterUpload}
								isUploading={isUploading}
								serverUploadProgress={currentProgress}
								showToast
								toastOptions={{
									uploadingMsg: 'Uploading letter...',
									successMsg: 'Letter uploaded successfully',
									errorHandler: (error: string) => `Failed to upload letter: ${error}`,
								}}
								uploadType="server"
							>
								{inputRef => (
									<Button
										type="button"
										variant="outline"
										onClick={() => inputRef.current?.click()}
										disabled={isSubmitting}
									>
										Upload Letter
									</Button>
								)}
							</FileUpload>
						)
					: (
							<div
								className="border flex items-center gap-2 w-fit px-4 py-2 rounded-lg bg-green-500/10 border-green-500/20 text-xs text-green-500"
							>
								<CheckIcon className="size-[16px]" />
								Letter Uploaded
							</div>
						)}

			</div>
			<Button type="submit" loading={isSubmitting}>
				Become a Merchant
			</Button>
		</ManagedForm>
	);
};

export default BecomeMerchantForm;
