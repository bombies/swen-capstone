import * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export type DefaultInputProps = {
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	inputClassName?: string;
	typingEndDelay?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement> & {
	ref?: React.Ref<HTMLInputElement>;
}, 'type'>;

export type InputProps = DefaultInputProps & ({
	type: 'number';
	onValueChange?: (value: number) => void;
	onTypingEnd?: (value: number) => void;
} | {
	type?: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
	onValueChange?: (value: string) => void;
	onTypingEnd?: (value: string) => void;
});

const Input: React.FC<InputProps> = (
	{ ref, className, type, startContent, endContent, inputClassName, onChange, onValueChange, onTypingEnd, typingEndDelay = 400, ...props },
) => {
	const [isFocused, setIsFocused] = useState(false);
	const [currentValue, setCurrentValue] = useState<string | number>(type === 'number' ? 0 : '');

	useEffect(() => {
		if (!onTypingEnd) return;

		const timeout = setTimeout(() => {
			if (type === 'number')
				onTypingEnd?.(currentValue as number);
			else
				onTypingEnd?.(currentValue as string);
		}, typingEndDelay);

		return () => clearTimeout(timeout);
	}, [currentValue, onTypingEnd, type, typingEndDelay]);

	return (
		<div
			className={cn(
				'flex items-center h-10 w-full bg-background text-foreground rounded-lg border border-border overflow-hidden',
				startContent && 'pl-3',
				endContent && 'pr-3',
				isFocused && 'focus-visible:!outline-0 ring-2 ring-primary',
				className,
			)}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
		>
			{startContent && <div className="shrink-0 self-center pr-3 text-foreground/20">{startContent}</div>}
			<input
				type={type}
				className={cn(
					'self-center w-full h-full px-3 text-sm text-foreground rounded-xl !ring-0 focus-visible:!outline-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/20 disabled:cursor-not-allowed disabled:opacity-50',
					startContent && 'pl-0 pr-3',
					endContent && 'pr-0 pl-3',
					startContent && endContent && 'pr-0 pl-0',
					inputClassName,
				)}
				ref={ref}
				onChange={(e) => {
					if (onChange) onChange(e);
					setCurrentValue(type === 'number' ? Number(e.target.value) : e.target.value);
					if (type === 'number')
						onValueChange?.(Number(e.target.value));
					else
						onValueChange?.(e.target.value);
				}}
				{...props}
			/>
			{endContent && <div className="shrink-0 self-center pl-3 text-foreground/20">{endContent}</div>}
		</div>
	);
};
Input.displayName = 'Input';

export { Input };
