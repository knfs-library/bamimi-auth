const { MFA } = require('../../lib/cjs/multiFactorAuth'); // Đảm bảo thay đổi đường dẫn đến file MFA

describe('MFA', () => {
	let mfaInstance;

	beforeEach(() => {
		mfaInstance = new MFA({ appName: 'TestApp' });
	});

	test('generateSecretKey generates a secret key', () => {
		const secretKey = mfaInstance.generateSecretKey();
		expect(secretKey).toBeDefined();
	});

	test('generateUrlWithSecret generates a valid URL', () => {
		const id = 'user123@';
		const secret = 'somesecret';
		const url = mfaInstance.generateUrlWithSecret(id, secret);
		expect(url).toMatch(/^otpauth:\/\/totp\//);
	});

	test('check method verifies token with secret', () => {
		const secret = mfaInstance.generateSecretKey();
		const token = mfaInstance.generateToken(secret)

		const isVerified = mfaInstance.check(token, secret);
		expect(isVerified).toBeTruthy();
	});

	test('generateQRCode method generates QR code', async () => {
		const secret = mfaInstance.generateSecretKey(); 
		const id = 'user123@';
		const url = mfaInstance.generateUrlWithSecret(id, secret);

		const qr = await mfaInstance.generateQRCode(url);
		expect(qr).toHaveProperty('baseData');
		expect(qr).toHaveProperty('image');
	});
});
