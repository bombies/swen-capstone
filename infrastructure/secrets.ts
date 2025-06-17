export const mongoDBUri = new sst.Secret('MongoDbUri');
export const jwtSecret = new sst.Secret('JwtSecret');
export const paypalApiUrl = new sst.Secret(
	'PaypalApiUrl',
	!$dev ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com',
);
export const paypalAccessToken = new sst.Secret('PayPalAccessToken');
export const paypalClientId = new sst.Secret('PayPalClientId');
