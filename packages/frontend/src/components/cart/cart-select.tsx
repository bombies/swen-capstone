'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useGetAllCarts } from '@/api-utils/hooks/cart.hooks';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CreateCartDialog } from './create-cart-dialog';

interface CartSelectProps {
	onSelect: (cartId: string) => void;
	disabled?: boolean;
}

export function CartSelect({ onSelect, disabled }: CartSelectProps) {
	const [open, setOpen] = useState(false);
	const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
	const { data: carts, isLoading } = useGetAllCarts();

	const handleSelectCart = (cartId: string) => {
		setSelectedCartId(cartId);
		onSelect(cartId);
		setOpen(false);
	};

	const handleCartCreated = (cartId: string) => {
		handleSelectCart(cartId);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
					disabled={disabled || isLoading}
				>
					{isLoading
						? 'Loading carts...'
						: selectedCartId
							? carts?.find(cart => cart._id === selectedCartId)?.name || `Cart #${selectedCartId}`
							: 'Select a cart'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search carts..." />
					<CommandEmpty>No carts found.</CommandEmpty>
					<CommandGroup>
						{carts?.map(cart => (
							<CommandItem
								key={cart._id}
								value={cart.name}
								onSelect={() => handleSelectCart(cart._id)}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										cart._id === selectedCartId ? 'opacity-100' : 'opacity-0',
									)}
								/>
								{cart.name}
								{' '}
								•
								{' '}
								{cart.totalItems}
								{' '}
								items
							</CommandItem>
						))}
						<CommandItem
							onSelect={() => setOpen(false)}
							className="p-0 mt-2"
							asChild
						>
							<CreateCartDialog
								onCartCreated={handleCartCreated}
								disabled={disabled}
								className="w-full"
							/>
						</CommandItem>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
