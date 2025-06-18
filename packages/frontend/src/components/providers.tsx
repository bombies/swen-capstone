'use client';

import type { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PayPalProvider } from '@/components/providers/paypal-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { MerchantProvider } from '@/contexts/merchant-context';
import { AuthSync } from './auth-sync';

type Props = PropsWithChildren;

const queryClient = new QueryClient();

const Providers: FC<Props> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<MerchantProvider>
					<PayPalProvider>
						<AuthSync />
						{children}
					</PayPalProvider>
				</MerchantProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default Providers;
