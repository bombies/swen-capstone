import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const remotePatterns: RemotePattern[] = [
	{
		protocol: 'https',
		hostname: 'i.scdn.co',
	},
];

if (process.env.NEXT_PUBLIC_CDN_URL) {
	remotePatterns.push({
		protocol: 'https',
		hostname: process.env.NEXT_PUBLIC_CDN_URL.replace('https://', '').split('/')[0],
	});
}

const nextConfig: NextConfig = {
	images: {
		remotePatterns,
	},
	poweredByHeader: false,
	reactStrictMode: true,
	eslint: {
		dirs: ['.'],
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
			{
				source: '/notification-worker.js',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript; charset=utf-8',
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
					{
						key: 'Content-Security-Policy',
						value: 'default-src \'self\'; script-src \'self\'',
					},
				],
			},
		];
	},
};

export default nextConfig;
