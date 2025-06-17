import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	try {
		const { orderId } = await params;

		// Get Paypal Access Token
		const tokenResponse = (await axios.post<{
			scope: string;
			access_token: string;
			token_type: string;
			app_id: string;
			expires_in: number;
			nonce: string;
		}>(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth: {
				username: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
				password: process.env.PAYPAL_ACCESS_TOKEN || '',
			},
		})).data;

		// Capture PayPal order
		const response = await fetch(
			`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${tokenResponse.access_token}`,
				},
			},
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Failed to capture PayPal order');
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error('PayPal order capture error:', error);
		return NextResponse.json(
			{ error: 'Failed to capture PayPal order' },
			{ status: 500 },
		);
	}
}
