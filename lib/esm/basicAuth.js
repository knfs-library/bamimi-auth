import { check as passwordBasedCheck } from "./passwordBasedAuth";

/**
 * Authentication check function
 * 
 * @param {*} originalData 
 * @param {Buffer | String} authorizationHeader 
 * @param {{idFields: Array<string> , pinField: string}} fields 
 * @returns 
 */
const check = async (originalData, authorizationHeader, { idFields = ['username'], pinField = 'password' }) => {
	// Parse the Authorization header to get the authentication type
	const authorization = authorizationHeader.split(' ');
	const typeAuth = authorization[0];

	if (!typeAuth || "Basic" !== typeAuth) {
		return false;
	}

	const credentialsBase64 = authorization[1];
	const decodedCredentials = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
	const [id, pin] = decodedCredentials.split(':');

	if (!id || !pin) {
		return false;
	}

	let comparisonData = {
		id
	};
	comparisonData[pinField] = pin;
	if (!(await passwordBasedCheck(originalData, comparisonData, { idFields, pinField }))) {
		return false;
	}

	return true;
};

export { check };
