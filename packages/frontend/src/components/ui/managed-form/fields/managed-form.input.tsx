'use client';

import type { JSX } from 'react';
import type z from 'zod';
import type { InputProps } from '@/components/ui/input';
import type { ManagedFormFieldProps } from '@/components/ui/managed-form/managed-form-field';
import type { TextareaProps } from '@/components/ui/textarea';
import { useMemo } from 'react';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import ManagedFormField from '@/components/ui/managed-form/managed-form-field';
import { Textarea } from '@/components/ui/textarea';

type GlobalProps<T extends z.ZodTypeAny> = Omit<ManagedFormFieldProps<T>, 'children'>;

// Create props for each specific input type
type StringInputProps<T extends z.ZodTypeAny> = GlobalProps<T> & {
	type?: 'string';
	inputProps?: InputProps;
};

type PasswordInputProps<T extends z.ZodTypeAny> = GlobalProps<T> & {
	type: 'password';
	inputProps?: InputProps;
};

type TextareaInputProps<T extends z.ZodTypeAny> = GlobalProps<T> & {
	type: 'textarea';
	inputProps?: TextareaProps;
};

// Create a union type that discriminates on the type field
type EasyFormInputProps<T extends z.ZodTypeAny>
	= | StringInputProps<T>
		| PasswordInputProps<T>
		| TextareaInputProps<T>;

// Function overloads to provide precise typing
function ManagedFormInput<T extends z.ZodTypeAny>(props: StringInputProps<T>): JSX.Element;
function ManagedFormInput<T extends z.ZodTypeAny>(props: PasswordInputProps<T>): JSX.Element;
function ManagedFormInput<T extends z.ZodTypeAny>(props: TextareaInputProps<T>): JSX.Element;

// Implementation
function ManagedFormInput<T extends z.ZodTypeAny>({
	type = 'string',
	inputProps,
	...formFieldProps
}: EasyFormInputProps<T>) {
	const Component = useMemo(() => {
		switch (type) {
			case 'password': return PasswordInput;
			case 'textarea': return Textarea;
			default: return Input;
		}
	}, [type]);

	return (
		<ManagedFormField<T> {...formFieldProps}>
			{(_form, field) => (
				<Component
					{...inputProps as any}
					{...field}
					value={field.value ?? ((inputProps as any)?.type === 'number' ? 0 : '')}
					defaultValue={undefined}
				/>
			)}
		</ManagedFormField>
	);
}

export default ManagedFormInput;
