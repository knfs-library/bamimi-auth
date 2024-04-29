const { faker } = require("@faker-js/faker");
const { check } = require('../../lib/cjs/basicAuth');

// Mock dependencies or constants if needed
jest.mock('../../lib/cjs/passwordBasedAuth', () => ({
	check: jest.fn().mockReturnValue(true) // Mock the passwordBasedCheck function to always return true
}));

describe('Basic auth check function', () => {
	const password = faker.internet.password(20)
	const originalData = {
		username: faker.internet.userName(),
		email: faker.internet.email(),
	}

	const generateAuthorizationHeader = (id, pin) => {
		const credentialsBase64 = Buffer.from(`${id}:${pin}`).toString('base64');
		return `Basic ${credentialsBase64}`;
	};


	beforeAll(async () => {
		originalData.password = password
	})

	test('Missing type auth', async () => {
		// Arrange
		const options = { idFields: ['username'], pinField: 'password' };

		const result = await check(originalData, "abcccccccccc", options);

		expect(result).toEqual(false);
	});

	test('Invalid type auth', async () => {
		// Arrange
		const options = { idFields: ['username'], pinField: 'password' };

		const result = await check(originalData, "Bearer abcccccccccc", options);

		expect(result).toEqual(false);
	});

	test('Valid credentials with username as idField', async () => {
		const username = 'username';
		const password = 'password';
		const authorizationHeader = generateAuthorizationHeader(username, password);
		const options = { idFields: ['username'], pinField: 'password' };

		const result = await check(originalData, authorizationHeader, options);

		expect(result).toEqual(true);
	});

	test('Invalid credentials with missing id', async () => {
		const password = 'password';
		const authorizationHeader = generateAuthorizationHeader("",password);
		const options = { idFields: ['username'], pinField: 'password' };

		const result = await check(originalData, authorizationHeader, options);

		expect(result).toEqual(false);
	});

	test('Invalid credentials with missing id', async () => {
		const username = 'username';
		const authorizationHeader = generateAuthorizationHeader(username, "");
		const options = { idFields: ['username'], pinField: 'password' };

		const result = await check(originalData, authorizationHeader, options);

		expect(result).toEqual(false);
	});
});
