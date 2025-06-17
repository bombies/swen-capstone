'use client';

export interface Tokens {
	tokenId: string;
	accessToken: string;
	refreshToken: string;
}

export const setTokens = ({ accessToken, refreshToken, tokenId }: Tokens) => {
	// Store in localStorage
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
	localStorage.setItem('tokenId', tokenId);

	// Store in cookies
	document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
	document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Strict`; // 30 days
	document.cookie = `tokenId=${tokenId}; path=/; SameSite=Strict`; // 30 days
};

export const setAccessToken = (accessToken: string) => {
	// Store in localStorage
	localStorage.setItem('accessToken', accessToken);

	// Store in cookies
	document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
};

export const getTokens = (): Tokens | null => {
	if (typeof window === 'undefined' || !localStorage)
		return null;

	// Try to get from localStorage first
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	const tokenId = localStorage.getItem('tokenId');

	if (accessToken && refreshToken && tokenId) {
		return { accessToken, refreshToken, tokenId };
	}

	// If not in localStorage, try cookies
	const cookies = document.cookie.split(';').reduce((acc, cookie) => {
		const [key, value] = cookie.trim().split('=');
		acc[key] = value;
		return acc;
	}, {} as Record<string, string>);

	if (cookies.accessToken && cookies.refreshToken) {
		// If found in cookies but not in localStorage, sync them
		setTokens({
			accessToken: cookies.accessToken,
			refreshToken: cookies.refreshToken,
			tokenId: cookies.tokenId,
		});
		return {
			accessToken: cookies.accessToken,
			refreshToken: cookies.refreshToken,
			tokenId: cookies.tokenId,
		};
	}

	return null;
};

export const clearTokens = () => {
	// Clear from localStorage
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('tokenId');

	// Clear from cookies
	document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Strict';
	document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Strict';
	document.cookie = 'tokenId=; path=/; max-age=0; SameSite=Strict';
};
