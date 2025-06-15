/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'marketplace',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'aws',
		};
	},
	async run() {
		const infra = await import('./infrastructure');

		return {
			ApiUrl: $dev ? 'http://localhost:3001' : infra.apiService.url,
			FrontendUrl: infra.frontend.url,
		};
	},
});
