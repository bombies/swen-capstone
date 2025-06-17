import { apiService } from './api';
import { jwtSecret, paypalAccessToken, paypalApiUrl, paypalClientId } from './secrets';
import { contentCdn } from './storage';

export const frontend = new sst.aws.Nextjs('Frontend', {
	path: 'packages/frontend',
	dev: {
		command: 'bun run dev',
	},
	server: {
		runtime: 'nodejs22.x',
		install: ['sharp'],
	},
	environment: {
		NEXT_PUBLIC_API_URL: $dev ? 'http://localhost:3001' : apiService.url,
		JWT_SECRET: jwtSecret.value,
		NEXT_PUBLIC_CDN_URL: $interpolate`${contentCdn.url}`,
		PAYPAL_API_URL: paypalApiUrl.value,
		PAYPAL_ACCESS_TOKEN: paypalAccessToken.value,
		NEXT_PUBLIC_PAYPAL_CLIENT_ID: paypalClientId.value,
	},
});
