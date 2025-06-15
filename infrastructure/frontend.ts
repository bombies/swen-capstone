import { apiService } from './api';
import { jwtSecret } from './secrets';

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
	},
});
