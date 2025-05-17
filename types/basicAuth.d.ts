/**
 * Options for the basicAuth.check function.
 */
export type BasicAuthOptions = {
    /**
     * An array of fields in the `originalData` that should be used to identify the user.
     * @default ['username']
     */
    idFields?: string[];
    /**
     * The field in the `originalData` that contains the user's password.
     * @default 'password'
     */
    pinField?: string;
};

/**
 * Checks if the provided credentials are valid using Basic Authentication.
 *
 * @param originalData - The original data to compare against. This data should contain the user's information, including the hashed password.
 * @param authorizationHeader - The Authorization header from the request. This should be a string in the format "Basic <base64 encoded credentials>".
 * @param options - Configuration options.
 * @returns A promise that resolves to `true` if the credentials are valid, and `false` otherwise.
 */
export declare function check(originalData: any, authorizationHeader: Buffer | string, options?: BasicAuthOptions): Promise<boolean>;
