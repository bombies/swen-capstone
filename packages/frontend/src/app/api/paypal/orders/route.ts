import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { cart } = body;

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

		// Create PayPal order
		const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tokenResponse.access_token}`,
			},
			body: JSON.stringify({
				intent: 'CAPTURE',
				purchase_units: [
					{
						amount: {
							currency_code: 'USD',
							value: cart.total.toString(),
							breakdown: {
								item_total: {
									currency_code: 'USD',
									value: cart.total.toString(),
								},
							},
						},
						items: cart.items,
					},
				],
			}),
		});

		const data = await response.json();

		console.log(data);

		if (!response.ok) {
			throw new Error(data.message || 'Failed to create PayPal order');
		}

		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof AxiosError) {
			console.error('Axios error:', error.response?.data, error.request._header);
		} else {
			console.error('PayPal order creation error:', error);
		}
		return NextResponse.json(
			{ error: 'Failed to create PayPal order' },
			{ status: 500 },
		);
	}
}
