'use client';

import type { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = PropsWithChildren;

const queryClient = new QueryClient();

const Providers: FC<Props> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

export default Providers;
