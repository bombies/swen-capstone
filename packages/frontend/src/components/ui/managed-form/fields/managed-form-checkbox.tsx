'use client';

import type z from 'zod';
import type { ManagedFormFieldComponentProps } from '@/components/ui/managed-form/managed-form-field';
import ManagedFormLabel from '@/components/ui/managed-form/fields/managed-form-label';
import ManagedFormField from '@/components/ui/managed-form/managed-form-field';
import { Checkbox } from '../../checkbox';
import { FormDescription, FormItem, FormMessage } from '../../form';

type Props<T extends z.ZodTypeAny> = ManagedFormFieldComponentProps<T> & {
	defaultValue?: boolean;
};

export default function EasyFormCheckbox<T extends z.ZodTypeAny>({
	name,
	className,
	label,
	labelClassName,
	description,
	showErrorMessage,
	optional,
	defaultValue,
}: Props<T>) {
	return (
		<ManagedFormField
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && (
						<ManagedFormLabel className={labelClassName} optional={optional}>
							{label}
						</ManagedFormLabel>
					)}
					<Checkbox
						className={className}
						defaultChecked={defaultValue}
						checked={field.value ?? defaultValue ?? false}
						onCheckedChange={field.onChange}
					/>
					{description && <FormDescription>{description}</FormDescription>}
					{showErrorMessage && <FormMessage />}
				</FormItem>
			)}
		/>
	);
};
