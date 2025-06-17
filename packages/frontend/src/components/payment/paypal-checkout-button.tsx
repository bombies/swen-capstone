import type { CartWithRefs } from '@/api-utils/types/cart.types';
import type { Address } from '@/api-utils/types/order.types';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateOrder } from '@/api-utils/hooks/order.hooks';

interface PayPalCheckoutButtonProps {
	cart: CartWithRefs;
	shippingAddress: Address;
	disabled?: boolean;
}

export function PayPalCheckoutButton({ cart, shippingAddress, disabled }: PayPalCheckoutButtonProps) {
	const router = useRouter();
	const { mutate: createOrder } = useCreateOrder();

	const handleCreateOrder = async () => {
		try {
			const response = await fetch('/api/paypal/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					cart: {
						items: cart.items.map(item => ({
							name: item.product.name,
							quantity: item.quantity,
							unit_amount: {
								currency_code: 'USD',
								value: item.price.toString(),
							},
						})),
						total: cart.items.reduce(
							(acc, item) => acc + (item.price * item.quantity),
							0,
						).toFixed(2),
					},
				}),
			});

			const data = await response.json();
			return data.id;
		} catch (error) {
			toast.error('Failed to create PayPal order');
			throw error;
		}
	};

	const handleApprove = async (data: { orderID: string }) => {
		try {
			// Capture the PayPal order
			const captureResponse = await fetch(`/api/paypal/orders/${data.orderID}/capture`, {
				method: 'POST',
			});

			if (!captureResponse.ok) {
				throw new Error('Failed to capture PayPal order');
			}

			// Create order in our system
			createOrder(
				{
					cart: cart._id,
					customer: cart.customer,
					items: cart.items.map(item => ({
						product: item.product._id,
						merchant: item.merchant,
						quantity: item.quantity,
						price: item.price,
					})),
					shippingAddress,
					totalItems: cart.items.length,
					totalAmount: cart.items.reduce(
						(acc, item) => acc + (item.price * item.quantity),
						0,
					),
				},
				{
					onSuccess: () => {
						toast.success('Order created successfully');
						router.push('/orders');
					},
					onError: () => {
						toast.error('Failed to create order');
					},
				},
			);
		} catch (error) {
			toast.error('Failed to process payment');
			throw error;
		}
	};

	return (
		<PayPalButtons
			style={{
				layout: 'vertical',
				shape: 'rect',
				label: 'pay',
			}}
			createOrder={handleCreateOrder}
			onApprove={handleApprove}
			onError={() => {
				toast.error('Payment failed');
			}}
			disabled={disabled}
		/>
	);
}
