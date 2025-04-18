export type ReturnTypeValues = JWT_CONST[keyof JWT_CONST] | MFA_CONST[keyof MFA_CONST];
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
export type ConfigType = {
    /**
     * Configuration for password-based authentication.
     */
    accessPassword: {
        idFields: string[];
        pinField: string;
    };
    /**
     * Configuration for token-based authentication (JWT).
     */
    tokenBasedToken: {
        accessToken: {
            secretKey: string | null;
            options: any;
        };
        refreshToken: {
            secretKey: string | null;
            options: any;
            multiple: boolean;
            use: boolean;
        };
        useBlacklist: boolean;
        storage: storageType;
        fields: string[];
    };
    /**
     * Configuration for multi-factor authentication (MFA).
     */
    mfa: {
        appName: string;
        fieldId: string;
    };
};
/**
 * Class Auth defines authentication system.
 */
export class Auth {
    /**
     * Static variable to hold the instance of Auth class.
     * @private
     * @type {Auth | null}
     */
    private static instance;
    /**
     * Initializes the Auth instance (Singleton pattern).
     * @param {ConfigType} [config=null] Configuration object for the authentication system.
     * @returns {Auth} The Auth instance.
     */
    static init(config?: ConfigType): Auth;
    /**
     * Gets the Auth instance. Throws an error if the instance hasn't been initialized.
     * @returns {Auth} The Auth instance.
     * @throws {Error} If Auth hasn't been initialized.
     */
    static getAuth(): Auth;
    /**
     * Constructor for Auth class.
     * @param {ConfigType} [config=null] Configuration object for the authentication system. If not provided, the default `configType` will be used.
     */
    constructor(config?: ConfigType);
    config: ConfigType;
    /**
     * Gets the BasicAuth module.
     * @returns {BasicAuth} The BasicAuth module.
     */
    getBasicAuth(): typeof BasicAuth;
    /**
     * Gets the PasswordBasedAuth module.
     * @returns {PasswordBasedAuth} The PasswordBasedAuth module.
     */
    getPasswordBasedAuth(): typeof PasswordBasedAuth;
    /**
     * Gets the JWT module.
     * @returns {JWT} The JWT module.
     */
    getJWT(): JWT;
    /**
     * Gets the MFA module.
     * @returns {MFA} The MFA module.
     */
    getMFA(): MFA;
    /**
     * Verifies the provided comparison data against the original data using password-based authentication.
     * @param {Object} originalData The original data to compare against.
     * @param {Object} comparisonData The comparison data.
     * @param {string} [returnType='bool'] The return type ('bool' or 'token').
     * @returns {Promise<boolean|Object>} `true` if verification is successful, or an object containing tokens if `returnType` is 'token'.
     */
    verifyWithPassword(originalData: any, comparisonData: any, returnType?: string): Promise<boolean | any>;
    /**
     * Hashes a password using bcrypt.
     * @param {string} password The password to hash.
     * @param {number} [saltRounds=10] The number of salt rounds to use.
     * @returns {Promise<string>} The hashed password.
     */
    hashPassword(password: string, saltRounds?: number): Promise<string>;
    /**
     * Verifies the provided authorization header against the original data using basic authentication.
     * @param {Object} originalData The original data to compare against.
     * @param {string} authorizationHeader The authorization header.
     * @returns {Promise<boolean>} `true` if verification is successful, `false` otherwise.
     */
    verifyWithBasicAuth(originalData: any, authorizationHeader: string): Promise<boolean>;
    /**
     * Generates MFA (Multi-Factor Authentication) secret and URL.
     * @param {Object} originalData The original data containing user information.
     * @param {string} [returnType='secret'] The return type ('secret', 'url', or 'qr').
     * @returns {Promise<string|Object>} The MFA secret, URL, or QR code data.
     */
    generateMFA(originalData: any, returnType?: string): Promise<string | any>;
    /**
     * Generates an OTP (One-Time Password) from a secret.
     * @param {string} secret The secret key.
     * @returns {string} The generated OTP.
     */
    generateOTP(secret: string): string;
    #private;
}
/**
 * @typedef {'memory' | 'redis'} StorageTypeEnum
 */
/**
 * @typedef storageType
 * @property {StorageTypeEnum} type The type of storage to use ('memory' or 'redis').
 * @property {*} options Options for the storage (e.g., Redis connection details).
 */
/**
 * @typedef {Object} ConfigType
 * @property {Object} accessPassword Configuration for password-based authentication.
 * @property {string[]} accessPassword.idFields Fields to identify the user (e.g., 'username').
 * @property {string} accessPassword.pinField Field for the password (e.g., 'password').
 * @property {Object} tokenBasedToken Configuration for token-based authentication (JWT).
 * @property {Object} tokenBasedToken.accessToken Configuration for access tokens.
 * @property {string|null} tokenBasedToken.accessToken.secretKey Secret key for access tokens.
 * @property {*} tokenBasedToken.accessToken.options Options for access token generation.
 * @property {Object} tokenBasedToken.refreshToken Configuration for refresh tokens.
 * @property {string|null} tokenBasedToken.refreshToken.secretKey Secret key for refresh tokens.
 * @property {*} tokenBasedToken.refreshToken.options Options for refresh token generation.
 * @property {boolean} tokenBasedToken.refreshToken.multiple Whether multiple refresh tokens are allowed.
 * @property {boolean} tokenBasedToken.refreshToken.use
 * @property {boolean} tokenBasedToken.useBlacklist Whether to use a token blacklist.
 * @property {storageType} tokenBasedToken.storage Configuration for token storage.
 * @property {string[]} tokenBasedToken.fields Fields to include in the token payload.
 * @property {Object} mfa Configuration for multi-factor authentication (MFA).
 * @property {string} mfa.appName Application name for MFA. This is displayed in the authenticator app.
 * @property {string} mfa.fieldId Field to identify the user for MFA.
 */
/** @type {ConfigType} */
export const configType: ConfigType;
export namespace RETURN_TYPE {
    export { JWT_CONST as JWT };
    export { MFA_CONST as MFA };
}
/**
 * *
 */
type JWT_CONST = string;
declare namespace JWT_CONST {
    let BOOL: string;
    let TOKEN: string;
}
type MFA_CONST = string;
declare namespace MFA_CONST {
    let SECRET: string;
    let URL: string;
    let ORCODE: string;
}
import BasicAuth = require("./basicAuth");
import PasswordBasedAuth = require("./passwordBasedAuth");
import { JWT } from "./tokenBasedAuth";
import { MFA } from "./multiFactorAuth";
export {};
