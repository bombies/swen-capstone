import type { FC, PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getServerSideAuth } from '@/lib/auth-actions';

const OrdersLayout: FC<PropsWithChildren> = async ({ children }) => {
	const auth = await getServerSideAuth();

	if (!auth)
		redirect('/auth/login');

	return children;
};

export default OrdersLayout;
