/**
 * Checks if the provided comparison data matches the original data using bcrypt.
 *
 * @param {Object} originalData The original data containing the hashed password and user ID.
 * @param {{id: string, [key: string]: any}} comparisonData The data to compare, with ID and plaintext password.
 * @param {Object} fields Configuration object for field names.
 * @param {Array<string>} fields.idFields An array of field names used for ID (e.g., ['username']).
 * @param {string} fields.pinField The name of the field containing the password hash (e.g., 'password').
 * @returns {Promise<boolean>} Returns true if authentication passes.
 */
export function check(originalData: any, comparisonData: {
    id: string;
    [key: string]: any;
}, { idFields, pinField }: {
    idFields: Array<string>;
    pinField: string;
}): Promise<boolean>;
/**
 * Hashes a PIN (password) using bcrypt.
 *
 * @param {string} pin
 * @param {number} [saltRounds=10]
 * @returns {Promise<string>}
 */
export function hashPin(pin: string, saltRounds?: number): Promise<string>;
