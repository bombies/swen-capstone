'use client';

export interface Tokens {
	tokenId: string;
	accessToken: string;
	refreshToken: string;
}

interface TokenExpiry {
	accessTokenExpiry: number;
	refreshTokenExpiry: number;
}

const ACCESS_TOKEN_EXPIRY = 3600; // 1 hour in seconds
const REFRESH_TOKEN_EXPIRY = 2592000; // 30 days in seconds

const getExpiryTimestamps = (): TokenExpiry => {
	const now = Math.floor(Date.now() / 1000);
	return {
		accessTokenExpiry: now + ACCESS_TOKEN_EXPIRY,
		refreshTokenExpiry: now + REFRESH_TOKEN_EXPIRY,
	};
};

export const setTokens = ({ accessToken, refreshToken, tokenId }: Tokens) => {
	const { accessTokenExpiry, refreshTokenExpiry } = getExpiryTimestamps();

	// Store in localStorage
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);
	localStorage.setItem('tokenId', tokenId);
	localStorage.setItem('accessTokenExpiry', accessTokenExpiry.toString());
	localStorage.setItem('refreshTokenExpiry', refreshTokenExpiry.toString());

	// Store in cookies
	document.cookie = `accessToken=${accessToken}; path=/; max-age=${ACCESS_TOKEN_EXPIRY}; SameSite=Strict`;
	document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${REFRESH_TOKEN_EXPIRY}; SameSite=Strict`;
	document.cookie = `tokenId=${tokenId}; path=/; SameSite=Strict`;
};

export const setAccessToken = (accessToken: string) => {
	const { accessTokenExpiry } = getExpiryTimestamps();

	// Store in localStorage
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('accessTokenExpiry', accessTokenExpiry.toString());

	// Store in cookies
	document.cookie = `accessToken=${accessToken}; path=/; max-age=${ACCESS_TOKEN_EXPIRY}; SameSite=Strict`;
};

const areTokensExpired = (): boolean => {
	if (typeof window === 'undefined') return true;

	const now = Math.floor(Date.now() / 1000);
	const accessTokenExpiry = Number.parseInt(localStorage.getItem('accessTokenExpiry') || '0', 10);
	const refreshTokenExpiry = Number.parseInt(localStorage.getItem('refreshTokenExpiry') || '0', 10);

	return now >= accessTokenExpiry || now >= refreshTokenExpiry;
};

export const getTokens = (): Tokens | null => {
	if (typeof window === 'undefined' || !localStorage) return null;

	// Check if tokens are expired
	if (areTokensExpired()) {
		clearTokens();
		return null;
	}

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
	localStorage.removeItem('accessTokenExpiry');
	localStorage.removeItem('refreshTokenExpiry');

	// Clear from cookies
	document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Strict';
	document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Strict';
	document.cookie = 'tokenId=; path=/; max-age=0; SameSite=Strict';
};
