'use client';

import type { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions: ReactPayPalScriptOptions = {
	clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
	currency: 'USD',
	intent: 'capture',
};

export function PayPalProvider({ children }: { children: React.ReactNode }) {
	return (
		<PayPalScriptProvider
			options={initialOptions}
		>
			{children}
		</PayPalScriptProvider>
	);
}
