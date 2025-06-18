'use client';

import type { Session } from '@/api-utils';
import type { User } from '@/api-utils';
import { createContext, use, useMemo } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useGetSelf } from '@/api-utils/hooks/user.hooks';
import { getTokens } from '@/lib/auth';
import { verifyToken } from '@/lib/auth-actions';

interface AuthContextType {
	tokenId: string | null;
	session: Session | null;
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [tokenId, setTokenId] = useState<string | null>(null);
	const lastTokenIdRef = useRef<string | null>(null);
	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { data: user, isLoading: userLoading, refetch } = useGetSelf();

	// Function to update tokens from storage with debouncing
	const updateTokensFromStorage = () => {
		// Clear any pending timeout
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}

		// Debounce the update to prevent rapid successive calls
		updateTimeoutRef.current = setTimeout(() => {
			const tokens = getTokens();
			const newTokenId = tokens?.tokenId || null;

			// Only update if tokenId actually changed
			if (newTokenId !== lastTokenIdRef.current) {
				lastTokenIdRef.current = newTokenId;
				setTokenId(newTokenId);
			}
		}, 100); // 100ms debounce
	};

	// Get tokens on mount
	useEffect(() => {
		updateTokensFromStorage();
	}, []);

	// Listen for storage changes (when tokens are set/cleared in other tabs/windows)
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === 'accessToken' || event.key === 'refreshToken' || event.key === 'tokenId') {
				updateTokensFromStorage();
			}
		};

		// Listen for storage events from other tabs/windows
		window.addEventListener('storage', handleStorageChange);

		// Also listen for custom events that can be dispatched when tokens change
		const handleTokenChange = () => {
			updateTokensFromStorage();
		};

		window.addEventListener('auth-token-change', handleTokenChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('auth-token-change', handleTokenChange);
			// Clean up timeout on unmount
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, []);

	// Verify token when it changes
	useEffect(() => {
		const tokens = getTokens();
		if (!tokens?.accessToken) {
			setSession(null);
			return;
		}

		(async () => {
			try {
				const session = await verifyToken(tokens.accessToken);
				setSession(session as unknown as Session | null);
			} catch (error) {
				console.error('Token verification failed:', error);
				setSession(null);
			}
		})();
	}, [tokenId]);

	const value = useMemo<AuthContextType>(() => ({
		tokenId,
		session,
		user: user || null,
		isLoading: userLoading,
		isAuthenticated: !!(session && user),
		refetch,
	}), [tokenId, session, user, userLoading, refetch]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = use(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
