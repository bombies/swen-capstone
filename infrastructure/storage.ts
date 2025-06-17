import { appify } from './utils';

const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(appify('ContentCdnOriginAccessIdentity'));

export const contentBucket = new sst.aws.Bucket(`ContentBucket`, {
	access: 'public',
});

const contentBucketOriginId = appify('ContentBucketOriginId');
export const contentCdn = new sst.aws.Cdn('ContentCdn', {
	origins: [
		{
			domainName: contentBucket.nodes.bucket.bucketRegionalDomainName,
			originId: contentBucketOriginId,
			s3OriginConfig: {
				originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
			},
		},
	],
	domain: $app.stage === 'production' ? 'cdn.lumi.ajani.me' : undefined,
	defaultCacheBehavior: {
		allowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
		compress: true,
		cachedMethods: ['GET', 'HEAD'],
		targetOriginId: contentBucketOriginId,
		forwardedValues: {
			queryString: false,
			cookies: {
				forward: 'none',
			},
		},
		viewerProtocolPolicy: 'allow-all',
		minTtl: 0,
		defaultTtl: 3600,
		maxTtl: 86400,
	},
});
