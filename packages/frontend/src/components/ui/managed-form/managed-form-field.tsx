'use client';

import type { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type {
	ControllerFieldState,
	ControllerRenderProps,
	Path,
	PathValue,
	UseFormReturn,
	UseFormStateReturn,
} from 'react-hook-form';
import type { z } from 'zod';

import { useCallback, useEffect } from 'react';
import { useForm } from '@/components/ui/managed-form/managed-form-provider';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage, FormField as ShadFormField } from '../form';

export type ManagedFormFieldProps<T extends z.ZodTypeAny> = Readonly<{
	name: Path<z.infer<T>>;
	label?: string;
	children?:((
		form: UseFormReturn<z.infer<T>>,
		field: ControllerRenderProps<z.infer<T>, Path<z.infer<T>>>,
	) => ReactElement<ComponentPropsWithoutRef<typeof Slot>, typeof Slot>);
	showErrorMessage?: boolean;
	description?: string;
	className?: string;
	labelClassName?: string;
	optional?: boolean;
	defaultValue?: PathValue<z.infer<T>, Path<z.infer<T>>>;
	render?: ({
		field,
		fieldState,
		formState,
	}: {
		field: ControllerRenderProps<z.infer<T>>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<z.infer<T>>;
	}) => React.ReactElement<any>;
}>;

export type ManagedFormFieldComponentProps<T extends z.ZodTypeAny> = Pick<
	ManagedFormFieldProps<z.infer<T>>,
	'name' | 'label' | 'labelClassName' | 'className' | 'showErrorMessage' | 'optional' | 'description'
>;

export default function ManagedFormField<T extends z.ZodTypeAny>({
	name,
	label,
	children,
	description,
	showErrorMessage,
	className,
	labelClassName,
	optional,
	defaultValue,
	render,
}: ManagedFormFieldProps<T>) {
	const { form, submitting, disabled, requiredAsterisk } = useForm<T>();

	if (!render && !children)
		throw new Error(
			`Invalid configuration for EasyFormField with name: ${name}. You must provide either a "children" prop or a "render" prop to EasyFormField`,
		);

	useEffect(() => {
		if (defaultValue) form.setValue(name, defaultValue);
	}, []);

	const renderItem = useCallback(
		(
			form: UseFormReturn<z.infer<T>>,
			field: ControllerRenderProps<z.infer<T>, Path<z.infer<T>>>,
		) => {
			return children?.(form, field);
		},
		[children],
	);

	return (
		<ShadFormField
			control={form.control}
			disabled={submitting || disabled}
			name={name}
			render={({ field, fieldState, formState }) =>
				render?.({ field, formState, fieldState }) ?? (
					<FormItem className={className}>
						{label && (
							<FormLabel className={labelClassName}>
								{label}
								{' '}
								{optional
									? (
											<span className="italic text-neutral-400 text-xs">(optional)</span>
										)
									: (
											requiredAsterisk && <span className="text-xs text-red-500">*</span>
										)}
							</FormLabel>
						)}
						<FormControl defaultValue={defaultValue}>
							{renderItem(form, field)}
						</FormControl>
						{description && <FormDescription>{description}</FormDescription>}
						{showErrorMessage && <FormMessage />}
					</FormItem>
				)}
		/>
	);
}
