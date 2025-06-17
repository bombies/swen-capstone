'use client';

import type { Session } from '@/api-utils';
import { useEffect, useMemo, useState } from 'react';
import { useGetSelf } from '@/api-utils/hooks/user.hooks';
import { getTokens } from '@/lib/auth';
import { verifyToken } from '@/lib/auth-actions';

export function useAuth() {
	const tokens = useMemo(() => {
		return getTokens();
	}, []);

	const [session, setSession] = useState<Session | null>(null);
	const { data: user, isLoading: userLoading } = useGetSelf();

	useEffect(() => {
		if (!tokens?.accessToken) return;

		(async () => {
			const session = await verifyToken(tokens?.accessToken);
			setSession(session as unknown as Session | null);
		})();
	}, [tokens?.accessToken]);

	return {
		tokenId: tokens?.tokenId,
		session,
		user: {
			data: user,
			isLoading: userLoading,
		},
	};
}
