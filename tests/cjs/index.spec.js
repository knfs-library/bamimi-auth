const { Auth, RETURN_TYPE, configType } = require('./../../lib/cjs/index');
const sinon = require('sinon');
const { faker } = require("@faker-js/faker");

describe('Auth', () => {
	const originalData = {
		id: faker.datatype.uuid(),
		username: faker.internet.userName(),
		password: faker.internet.password(8),
		email: faker.internet.email()
	}
	afterEach(() => {
		sinon.restore(); // Khôi phục tất cả các mock sau mỗi test case
	});

	describe('#verifyWithPassword', () => {
		it('should return true when passwords match', async () => {
			const auth = Auth.init();
			sinon.stub(auth.getPasswordBasedAuth(), 'check').resolves(true);
			const result = await auth.verifyWithPassword(originalData, { username: originalData.username, password: originalData.password });
			expect(result).toBe(true);
		});

		it('should return token object when return type is set to a token', async () => {
			const config = { ...configType }
			config.tokenBasedToken.accessToken.secretKey = "abc"
			const auth = Auth.init()
			sinon.stub(auth.getPasswordBasedAuth(), 'check').resolves(true);
			const result = await auth.verifyWithPassword(originalData, { username: originalData.username, password: originalData.password }, RETURN_TYPE.JWT.TOKEN);
			expect(result).toMatchObject({ accessToken: expect.any(String) });
		});

		it('should return token object when return type is set to 2 token', async () => {
			const config = { ...configType }
			config.tokenBasedToken.accessToken.secretKey = "abc"
			config.tokenBasedToken.refreshToken.secretKey = "abc"
			config.tokenBasedToken.refreshToken.use = "true"

			const auth = Auth.init()
			sinon.stub(auth.getPasswordBasedAuth(), 'check').resolves(true);
			const result = await auth.verifyWithPassword(originalData, { username: originalData.username, password: originalData.password }, RETURN_TYPE.JWT.TOKEN);
			expect(result).toMatchObject({ accessToken: expect.any(String), refreshToken: expect.any(String) });
		});

		it('should return false when passwords do not match', async () => {
			const auth = Auth.init();
			sinon.stub(auth.getPasswordBasedAuth(), 'check').resolves(false);
			const result = await auth.verifyWithPassword(originalData, { username: originalData.username, password: 'wrongpassword' });
			expect(result).toBe(false);
		});
	});

	describe('generateMFA', () => {
		it('should return a secret key by default', async () => {
			const secretKey = 'secretKey';
			const auth = Auth.init();
			sinon.stub(auth.getMFA(), 'generateSecretKey').returns(secretKey);

			const result = await auth.generateMFA(originalData);
			expect(result).toBe(secretKey);
		});

		it('should return a URL when returnType is set to "url"', async () => {
			const auth = Auth.init();
			const secretKey = 'secretKey';
			const url = 'https://example.com/mfa';
			sinon.stub(auth.getMFA(), 'generateSecretKey').returns(secretKey);
			sinon.stub(auth.getMFA(), 'generateUrlWithSecret').returns(url);

			const result = await auth.generateMFA(originalData, 'url');
			expect(result).toBe(url);
		});

		it('should return a QR code when returnType is set to "qr"', async () => {
			const auth = Auth.init();
			const secretKey = 'secretKey';
			const qrCode = 'QR Code';
			sinon.stub(auth.getMFA(), 'generateSecretKey').returns(secretKey);
			sinon.stub(auth.getMFA(), 'generateUrlWithSecret').returns('https://example.com/mfa');
			sinon.stub(auth.getMFA(), 'generateQRCode').resolves(qrCode);

			const result = await auth.generateMFA(originalData, 'qr');
			expect(result).toBe(qrCode);
		});
	});

	describe('#hashPassword', () => {
		it('should return a hashed password', async () => {
			const auth = Auth.init();
			const hashedPassword = await auth.hashPassword('password');
			expect(hashedPassword).toBeDefined();
			expect(hashedPassword).not.toEqual('password');
		});
	});

	// Thêm các test cases cho các phương thức khác của Auth ở đây
});
