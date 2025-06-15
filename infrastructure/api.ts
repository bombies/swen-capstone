import { jwtSecret, mongoDBUri } from './secrets';

export const vpc = new sst.aws.Vpc('Vpc');
export const apiCluster = new sst.aws.Cluster('ApiCluster', { vpc });

export const apiService = new sst.aws.Service('ApiService', {
	cluster: apiCluster,
	dev: {
		directory: 'packages/backend',
		command: 'bun run start:dev',
	},
	environment: {
		MONGODB_URI: mongoDBUri.value,
		JWT_SECRET: jwtSecret.value,
	},
});
