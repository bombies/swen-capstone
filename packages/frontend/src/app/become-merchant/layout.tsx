import type { FC, PropsWithChildren } from 'react';
import { requireAuth } from '@/lib/auth-actions';

const BecomeMerchantLayout: FC<PropsWithChildren> = async ({ children }) => {
	await requireAuth();
	return children;
};

export default BecomeMerchantLayout;
