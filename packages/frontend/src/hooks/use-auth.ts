'use client';

import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/actions';

interface User {
	id: string;
	email: string;
}

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshUser = useCallback(async () => {
		try {
			const user = await getCurrentUser();
			setUser(user);
		} catch (error) {
			console.error('Error fetching user:', error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	return {
		user,
		isLoading,
		refreshUser,
	};
}
