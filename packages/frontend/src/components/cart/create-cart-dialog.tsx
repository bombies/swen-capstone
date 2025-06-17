'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCreateCart } from '@/api-utils/hooks/cart.hooks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ManagedFormInput from '@/components/ui/managed-form/fields/managed-form.input';
import ManagedForm from '@/components/ui/managed-form/managed-form';
import { useAuth } from '@/hooks/use-auth';

const createCartSchema = z.object({
	name: z.string().min(1, 'Cart name is required').max(50, 'Cart name must be less than 50 characters'),
	defaultShippingAddress: z.string().optional(),
});

type CreateCartFormData = z.infer<typeof createCartSchema>;

interface CreateCartDialogProps {
	onCartCreated: (cartId: string) => void;
	disabled?: boolean;
	className?: string;
}

export function CreateCartDialog({ onCartCreated, disabled, className }: CreateCartDialogProps) {
	const [open, setOpen] = useState(false);
	const { user: { data: userData } } = useAuth();
	const { mutate: createCart, isPending: isCreating } = useCreateCart();

	const handleSubmit = (data: CreateCartFormData) => {
		if (!userData) {
			toast.error('You must be logged in to create a cart.');
			return;
		}

		createCart(
			{
				customer: userData._id,
				name: data.name,
				defaultShippingAddress: data.defaultShippingAddress,
			},
			{
				onSuccess: (newCart) => {
					toast.success('Cart created successfully!');
					onCartCreated(newCart._id);
					setOpen(false);
				},
				onError: () => {
					toast.error('Failed to create cart.');
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={className}
				>
					Create New Cart
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Cart</DialogTitle>
					<DialogDescription>
						Create a new cart to organize your shopping items.
					</DialogDescription>
				</DialogHeader>
				<ManagedForm
					schema={createCartSchema}
					onSubmit={handleSubmit}
				>
					<div className="grid gap-4 py-4">
						<ManagedFormInput
							name="name"
							label="Cart Name"
							description="Give your cart a name to help you identify it later"
							inputProps={{
								placeholder: 'e.g., Birthday Shopping',
							}}
						/>
						<ManagedFormInput
							name="defaultShippingAddress"
							label="Default Shipping Address"
							description="Optional: Set a default shipping address for this cart"
							inputProps={{
								placeholder: 'e.g., 123 Main St, City, Country',
							}}
						/>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isCreating}>
							{isCreating ? 'Creating...' : 'Create Cart'}
						</Button>
					</DialogFooter>
				</ManagedForm>
			</DialogContent>
		</Dialog>
	);
}
