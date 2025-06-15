'use client';

import type { PropsWithChildren } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { createContext, use, useMemo } from 'react';

type ContextValues<T extends z.ZodTypeAny = z.ZodAny> = {
	form: UseFormReturn<z.infer<T>>;
	submitting?: boolean;
	disabled?: boolean;
	requiredAsterisk: boolean;
};

const FormContext = createContext<ContextValues | undefined>(undefined);

type Props<T extends z.ZodTypeAny> = PropsWithChildren<{
	form: UseFormReturn<z.infer<T>>;
	formDisabled?: boolean;
	submitting?: boolean;
	requiredAsterisk?: boolean;
}>;

export default function ManagedFormProvider<T extends z.ZodTypeAny>({
	children,
	form,
	formDisabled,
	submitting,
	requiredAsterisk = false,
}: Props<T>) {
	const value = useMemo<ContextValues<z.infer<T>>>(
		() => ({
			form,
			submitting,
			disabled: formDisabled,
			requiredAsterisk,
		}),
		[form, formDisabled, requiredAsterisk, submitting],
	);

	return <FormContext value={value}>{children}</FormContext>;
}

export const useForm = <T extends z.ZodTypeAny>() => {
	const context = use(FormContext) as ContextValues<T> | undefined;
	if (!context) throw new Error('useForm must be used within a FormProvider');
	return context;
};
