interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export const setTokens = ({ accessToken, refreshToken }: Tokens) => {
	// Store in localStorage
	localStorage.setItem('accessToken', accessToken);
	localStorage.setItem('refreshToken', refreshToken);

	// Store in cookies
	document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
	document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Strict`; // 30 days
};

export const setAccessToken = (accessToken: string) => {
	// Store in localStorage
	localStorage.setItem('accessToken', accessToken);

	// Store in cookies
	document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
};

export const getTokens = (): Tokens | null => {
	// Try to get from localStorage first
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	if (accessToken && refreshToken) {
		return { accessToken, refreshToken };
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
		});
		return {
			accessToken: cookies.accessToken,
			refreshToken: cookies.refreshToken,
		};
	}

	return null;
};

export const clearTokens = () => {
	// Clear from localStorage
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');

	// Clear from cookies
	document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Strict';
	document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Strict';
};
