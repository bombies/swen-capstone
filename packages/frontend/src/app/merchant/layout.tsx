import { redirect } from 'next/navigation';
import { MerchantProvider } from '@/contexts/merchant-context';
import { requireAuth } from '@/lib/auth-actions';

export default async function MerchantLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = await requireAuth();

	if (auth.user.activeRole !== 'merchant')
		redirect('/');

	return <MerchantProvider>{children}</MerchantProvider>;
}
