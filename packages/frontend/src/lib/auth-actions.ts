'use server';

import type { JWTPayload } from 'jose';
import type { User } from '@/api-utils';
import type { RefreshTokenResponse } from '@/api-utils/types/auth.types';
import type { Tokens } from '@/lib/auth';
import axios from 'axios';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getTokens, setTokens } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret);
		logger.debug('Decoded token', payload);
		// Type assertion after validation
		if (
			typeof payload === 'object'
			&& payload !== null
			&& 'sub' in payload
			&& 'email' in payload
			&& 'iat' in payload
			&& 'exp' in payload
		) {
			return payload as JWTPayload;
		}
		return null;
	} catch (error) {
		// Check if error is due to expired token
		if (
			error instanceof Error
			&& error.message.includes('"exp" claim timestamp check failed')
		) {
			try {
				const tokens = getTokens();
				if (!tokens?.refreshToken) {
					logger.error('No refresh token available');
					return null;
				}

				// Call refresh token endpoint
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ refreshToken: tokens.refreshToken }),
				});

				if (!response.ok) {
					logger.error('Failed to refresh token');
					return null;
				}

				const data = (await response.json()) as RefreshTokenResponse;
				setTokens({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					tokenId: data.tokenId,
				});

				// Retry verification with new token
				return verifyToken(data.accessToken);
			} catch (refreshError) {
				logger.error('Error refreshing token:', refreshError);
				return null;
			}
		}

		logger.error('Error verifying token:', error);
		return null;
	}
}

export const getTokensFromCookies = async () => {
	const c = await cookies();
	const accessToken = c.get('accessToken')?.value;
	const refreshToken = c.get('refreshToken')?.value;
	const tokenId = c.get('tokenId')?.value;

	if (!accessToken || !refreshToken || !tokenId) {
		return null;
	}

	return {
		accessToken,
		refreshToken,
		tokenId,
	} satisfies Tokens;
};

export const getServerSideAuth = async () => {
	const tokens = await getTokensFromCookies();

	if (!tokens) {
		return null;
	}

	const jwtPayload = await verifyToken(tokens.accessToken);

	if (!jwtPayload) return null;

	const user = (await axios.get<User | null>(`${process.env.NEXT_PUBLIC_API_URL}/users/self`, {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`,
		},
	})).data;

	if (!user)
		return null;

	return { ...tokens, user };
};
