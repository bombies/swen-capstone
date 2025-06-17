'use client';

import { useEffect } from 'react';
import { clearTokens, getTokens } from '@/lib/auth';

export const AuthSync = () => {
	useEffect(() => {
		// Initial sync
		const syncTokens = () => {
			const tokens = getTokens();
			if (!tokens) {
				// If tokens are expired or not found, ensure everything is cleared
				clearTokens();
				console.debug('Auth tokens cleared due to expiration or not found');
			} else {
				console.debug('Auth tokens synced');
			}
		};

		// Run initial sync
		syncTokens();

		// Set up periodic sync every minute to check for expiration
		const intervalId = setInterval(syncTokens, 60 * 1000);

		// Cleanup interval on unmount
		return () => clearInterval(intervalId);
	}, []);

	// This component doesn't render anything
	return null;
};
