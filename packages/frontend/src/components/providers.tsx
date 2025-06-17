'use client';

import type { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PayPalProvider } from '@/components/providers/paypal-provider';
import { AuthSync } from './auth-sync';

type Props = PropsWithChildren;

const queryClient = new QueryClient();

const Providers: FC<Props> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<PayPalProvider>
				<AuthSync />
				{children}
			</PayPalProvider>

		</QueryClientProvider>
	);
};

export default Providers;
