import { check as passwordBasedCheck } from "./passwordBasedAuth.js";

/**
 * Authentication check function.
 *
 * @param {*} originalData The original data to compare against.
 * @param {Buffer | String} authorizationHeader The Authorization header from the request.  Must be in "Basic base64(username:password)" format.
 * @param {{idFields: Array<string> , pinField: string}} fields Configuration object specifying the fields to use for authentication.
 *        @param {Array<string>} idFields An array of field names in `originalData` that represent the user ID (e.g., username, email). Defaults to `['username']`.
 *        @param {string} pinField The field name in `originalData` that represents the user's PIN or password. Defaults to `'password'`.
 * @returns {Promise<boolean>} `true` if authentication is successful, `false` otherwise.
 */
const check = async (originalData, authorizationHeader, { idFields = ['username'], pinField = 'password' }) => {
	// Parse the Authorization header to get the authentication type
	const authorization = authorizationHeader.split(' ');
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

export { check };
