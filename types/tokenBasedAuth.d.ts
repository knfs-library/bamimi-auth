export type StorageTypeEnum = "memory" | "redis";
export type storageType = {
    /**
     * The type of storage to use ('memory' or 'redis').
     */
    type: StorageTypeEnum;
    /**
     * Options for the storage (e.g., Redis connection details).
     */
    options: any;
};
export type configType = {
    /**
     * Configuration for access tokens.
     */
    accessToken: {
        secretKey: string;
        options: any;
    };
    /**
     * Configuration for refresh tokens.
     */
    refreshToken: {
        secretKey: string;
        options: any;
        multiple: boolean;
        use: boolean;
    };
    /**
     * Whether to use a blacklist to revoke tokens.
     */
    useBlacklist: boolean;
    /**
     * Configuration for token storage (for refresh tokens and blacklist).
     */
    storage: storageType;
};
/**
 * @typedef storageType
 * @property {StorageTypeEnum} type The type of storage to use ('memory' or 'redis').
 * @property {*} options Options for the storage (e.g., Redis connection details).
 */
/**
 * @typedef {Object} configType
 * @property {Object} accessToken Configuration for access tokens.
 * @property {string} accessToken.secretKey Secret key used to sign access tokens.
 * @property {*} accessToken.options Options for generating access tokens (e.g., expiration time).
 * @property {Object} refreshToken Configuration for refresh tokens.
 * @property {string} refreshToken.secretKey Secret key used to sign refresh tokens.
 * @property {*} refreshToken.options Options for generating refresh tokens (e.g., expiration time).
 * @property {boolean} refreshToken.multiple Whether to allow multiple refresh tokens per user.
 * @property {boolean} refreshToken.use Whether to allow multiple refresh tokens per user.
 * @property {boolean} useBlacklist Whether to use a blacklist to revoke tokens.
 * @property {storageType} storage Configuration for token storage (for refresh tokens and blacklist).
 */
/**
 * Class for handling JWT (JSON Web Token) based authentication.
 */
export class JWT {
    /**
     * Constructor for the JWT class.
     * @param {configType} config Configuration object for JWT.
     */
    constructor(config: configType);
    config: configType;
    storage: any;
    /**
     * Generates a refresh token.
     * @param {*} data The data to include in the refresh token payload.
     * @returns {Promise<string>} The generated refresh token.
     * @throws {Error} If refresh token configuration is missing.
     */
    generateRefreshToken(data: any): Promise<string>;
    /**
     * Retrieves a saved refresh token from storage.
     * @param {string} token The refresh token to retrieve.
     * @returns {Promise<boolean>} True if the token exists, false otherwise.
     */
    getSavedRefreshToken(token: string): Promise<boolean>;
    /**
     *
     * @param {*} data
     * @param {*} options
     * @returns
     */
    generateAccessToken(data: any): Promise<any>;
    /**
     *
     * @param {String} token
     * @param {Boolean} isRefreshToken
     * @returns
     */
    verify(token: string, isRefreshToken?: boolean): Promise<any>;
    /**
     *
     * @param {String} token
     * @returns
     */
    genKeyBlackList(token: string): Promise<string>;
    /**
     *
     * @param {String} token
     * @returns
     */
    setBlacklist(token: string): Promise<boolean>;
    /**
     *
     * @param {String} token
     * @returns
     */
    checkBlacklist(token: string): Promise<any>;
    /**
     * Closes the connection to the storage (e.g., Redis).
     */
    closeConnection(): Promise<void>;
    #private;
}
export namespace storageTypeEnum {
    let MEMORY: string;
    let REDIS: string;
}
