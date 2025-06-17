import { redirect } from 'next/navigation';
import { MerchantProvider } from '@/contexts/merchant-context';
import { getServerSideAuth } from '@/lib/auth-actions';

export default async function MerchantLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = await getServerSideAuth();

	if (!auth)
		redirect('/auth/login');

	if (auth.user.activeRole !== 'merchant')
		redirect('/');

	return <MerchantProvider>{children}</MerchantProvider>;
}
