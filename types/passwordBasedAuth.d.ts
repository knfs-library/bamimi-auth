/**
 * Options for the password based check function.
 */
export interface PasswordBasedOptions {
    /**
     * An array of field names used for ID (e.g., ['username']).
     * @default ['username']
     */
    idFields?: string[];
    /**
     * The name of the field containing the password hash (e.g., 'password').
     * @default 'password'
     */
    pinField?: string;
}

/**
 * Checks if the provided comparison data matches the original data using bcrypt.
 * @param originalData The original data containing the hashed password and user ID.
 * @param comparisonData The data to compare, with ID and plaintext password.
 * @param fields Configuration object for field names.
 * @returns Returns true if authentication passes.
 */
export declare function check(originalData: any, comparisonData: {
    id: string;
    [key: string]: any;
}, fields?: PasswordBasedOptions): Promise<boolean>;
/**
 * Hashes a PIN (password) using bcrypt.
 * @param pin The password to hash.
 * @param saltRounds The number of salt rounds to use.
 * @returns The hashed password.
 */
export declare function hashPin(pin: string, saltRounds?: number): Promise<string>;
