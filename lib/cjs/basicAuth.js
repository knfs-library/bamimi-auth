const { check: passwordBasedCheck } = require("./passwordBasedAuth");

/**
 * @module basicAuth
 */

/**
 * Checks if the provided credentials are valid using Basic Authentication.
 *
 * @param {*} originalData - The original data to compare against. This data should contain the user's information, including the hashed password.
 * @param {Buffer | string} authorizationHeader - The Authorization header from the request. This should be a string in the format "Basic <base64 encoded credentials>".
 * @param {Object} options - Configuration options.
 * @param {string[]} [options.idFields=['username']] - An array of fields in the `originalData` that should be used to identify the user. Defaults to `['username']`.
 * @param {string} [options.pinField='password'] - The field in the `originalData` that contains the user's password. Defaults to `'password'`.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the credentials are valid, and `false` otherwise.
 *
 * @throws {Error} - Throws an error if the Authorization header is missing, invalid, or if the credentials are not valid.
 *
 * @example
 * ```javascript
 * const originalData = {
 *   username: 'testuser',
 *   password: 'hashedpassword'
 * };
 * const authorizationHeader = 'Basic dGVzdHVzZXI6cGFzc3dvcmQ='; // base64 encoded "testuser:password"
 *
 * basicAuth.check(originalData, authorizationHeader, { idFields: ['username'], pinField: 'password' })
 *   .then(isValid => {
 *     if (isValid) {
 *       console.log('Credentials are valid');
 *     } else {
 *       console.log('Credentials are not valid');
 *     }
 *   })
 *   .catch(err => {
 *     console.error(err);
 *   });
 * ```
 */
const check = async (originalData, authorizationHeader, { idFields = ['username'], pinField = 'password' }) => {
	// Parse the Authorization header to get the authentication type
	const authString = Buffer.isBuffer(authorizationHeader)
		? authorizationHeader.toString('utf8')
		: authorizationHeader;
	const authorization = authString.split(' ');
	const typeAuth = authorization[0];

	if (!typeAuth || "Basic" !== typeAuth) {
		return false
	}

	const credentialsBase64 = authorization[1];
	const decodedCredentials = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
	const [id, pin] = decodedCredentials.split(':');

	if (!id || !pin) {
		return false
	}

	let comparisonData = {
		id
	};
	comparisonData[pinField] = pin;

	if (!(await passwordBasedCheck(originalData, comparisonData, { idFields, pinField }))) {
		return false
	}

	return true
};

module.exports = {
	check
};
