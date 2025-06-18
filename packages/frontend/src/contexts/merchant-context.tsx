'use client';

import type { User } from '@/api-utils';
import type { Merchant } from '@/api-utils/types/merchant.types';
import { createContext, use, useMemo } from 'react';
import { useMyMerchantProfile } from '@/api-utils/hooks/merchant.hooks';
import { useAuth } from '@/contexts/auth-context';

interface MerchantContextType {
	merchant: Merchant | null;
	user: User | null;
	isOwnProfile: boolean;
	isLoading: boolean;
	refetch: () => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export function MerchantProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const { data: merchantData, isLoading, refetch } = useMyMerchantProfile();

	const value = useMemo<MerchantContextType>(() => ({
		merchant: merchantData || null,
		user: user || null,
		isOwnProfile: merchantData?.user._id === user?._id,
		isLoading,
		refetch,
	}), [isLoading, merchantData, refetch, user]);

	return (
		<MerchantContext.Provider value={value}>
			{children}
		</MerchantContext.Provider>
	);
}

export function useMerchant() {
	const context = use(MerchantContext);
	if (context === undefined) {
		throw new Error('useMerchant must be used within a MerchantProvider');
	}
	return context;
}
