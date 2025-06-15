import type { PropsWithChildren } from 'react';

import type { z } from 'zod';
import { useForm } from '@/components/ui/managed-form/managed-form-provider';
import { FormLabel } from '../../form';

type Props = PropsWithChildren<{
	className?: string;
	optional?: boolean;
}>;

function ManagedFormLabel<T extends z.ZodTypeAny>({ className, optional, children }: Props) {
	const { requiredAsterisk } = useForm<T>();
	return (
		<FormLabel className={className}>
			{children}
			{' '}
			{optional
				? (
						<span className="italic text-neutral-400 text-xs">(optional)</span>
					)
				: (
						requiredAsterisk && <span className="text-xs text-red-500">*</span>
					)}
		</FormLabel>
	);
}

export default ManagedFormLabel;
