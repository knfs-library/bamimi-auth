const bcrypt = require("bcrypt");

/**
 * @module passwordBasedAuth
 */

/**
 * Checks if the provided comparison data matches the original data using bcrypt.
 *
 * @param {Object} originalData The original data containing the hashed password and user ID.
 * @param {{id: string, [key: string]: any}} comparisonData The data to compare, with ID and plaintext password.
 * @param {Object} fields Configuration object for field names.
 * @param {Array<string>} fields.idFields An array of field names used for ID (e.g., ['username']).
 * @param {string} fields.pinField The name of the field containing the password hash (e.g., 'password').
 * @returns {Promise<boolean>} Returns true if authentication passes.
 * @throws {Error} If `pinField` is missing in `comparisonData`.
 */
const check = async (originalData, comparisonData, { idFields = ['username'], pinField = 'password' }) => {
	if (!idFields.some((id) => originalData[id] === comparisonData.id)) {
		return false;
	}

	if (!comparisonData[pinField]) {
		throw new Error(`Missing "${pinField}" in comparisonData`);
	}

	return await bcrypt.compare(comparisonData[pinField], originalData[pinField]);
};

/**
 * Hashes a PIN (password) using bcrypt.
 *
 * @param {string} pin The password to hash.
 * @param {number} [saltRounds=10] The number of salt rounds to use.
 * @returns {Promise<string>} The hashed password.
 */
const hashPin = async (pin, saltRounds = 10) => {
	return await bcrypt.hash(pin, saltRounds);
};

module.exports = {
	check,
	hashPin
};
