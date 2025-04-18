import bcrypt from "bcrypt";

/**
 * Checks if the provided comparison data matches the original data using bcrypt for password comparison.
 *
 * @param {Object} originalData The original data containing the hashed password and user ID.
 * @param {{id: string, ...}} comparisonData The data to compare against, containing the user ID and plain text password.
 * @param {{idFields: Array<string> , pinField: string}} fields Configuration object specifying the fields to use for authentication.
 *        @param {Array<string>} idFields An array of field names in `originalData` that represent the user ID (e.g., username, email). Defaults to `['username']`.
 *        @param {string} pinField The field name in `originalData` that represents the user's PIN or password. Defaults to `'password'`.
 * @returns {Promise<boolean>} `true` if the comparison is successful (password matches), `false` otherwise.
 */
const check = async (originalData, comparisonData, { idFields = ['username'], pinField = 'password' }) => {
	if (
		!idFields.some((id) => originalData[id] === comparisonData.id)
		||
		!bcrypt.compareSync(comparisonData[pinField], originalData[pinField])
	) {
		return false
	}

	return true
}

/**
 * Hashes a PIN (password) using bcrypt.
 *
 * @param {String} pin The PIN (password) to hash.
 * @param {Number} saltRounds The number of salt rounds to use for bcrypt.  Higher values are more secure but slower. Defaults to `10`.
 * @returns {Promise<string>} The hashed PIN.
 */
const hashPin = async (pin, saltRounds = 10) => {
	return bcrypt.hashSync(pin, saltRounds);
}

export { check, hashPin };
