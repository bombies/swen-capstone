'use server';

import type { JWTPayload } from 'jose';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function getAccessToken(): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get('accessToken');
	return token?.value ?? null;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret);
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
		console.error('Error verifying token:', error);
		return null;
	}
}

export async function getCurrentUser() {
	const token = await getAccessToken();
	if (!token) return null;

	const payload = await verifyToken(token);
	if (!payload) return null;

	return {
		id: payload.sub!,
		email: payload.email as string,
	};
}
