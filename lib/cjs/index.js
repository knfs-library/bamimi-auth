// Import necessary modules
const { MFA } = require("./multiFactorAuth");
const BasicAuth = require("./basicAuth");
const PasswordBasedAuth = require("./passwordBasedAuth");
const { JWT } = require("./tokenBasedAuth");
const _ = require('lodash');

/**
 * @enum {string}
 * @readonly
 */
const JWT_CONST = {
	BOOL: 'bool',
	TOKEN: 'token'
}

/**
 * @readonly
 * @enum {string}
 */
const MFA_CONST = {
	SECRET: 'secret',
	URL: 'url',
	ORCODE: 'qr'
}

// Define constants for return types
/**
 * @typedef {JWT_CONST[keyof JWT_CONST] | MFA_CONST[keyof MFA_CONST]} ReturnTypeValues
 */
/**
 * @readonly
 */
const RETURN_TYPE = {
	JWT: JWT_CONST,
	MFA: MFA_CONST
}
/**
 * @typedef {'memory' | 'redis'} StorageTypeEnum
 */

/**
 * @typedef storageType
 * @property {StorageTypeEnum} type The type of storage to use ('memory' or 'redis').
 * @property {*} options Options for the storage (e.g., Redis connection details).
 */

// Define configType object
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
const configType = {
	accessPassword: {
		idFields: ['username'],
		pinField: 'password'
	},
	tokenBasedToken: {
		accessToken: {
			secretKey: "",
			options: {}
		},
		refreshToken: {
			secretKey: "",
			options: {},
			multiple: false,
			use: false
		},
		useBlacklist: false,
		storage: {
			type: "memory",
			options: {}
		},
		fields: [
			"id",
			"username",
			"email"
		]
	},
	mfa: {
		appName: "@knfs-tech/bamimi-auth",
		fieldId: "id"
	}
}

/**
 * Class Auth defines authentication system.
 */
class Auth {
	/**
	 * Static variable to hold the instance of Auth class.
	 * @private
	 * @type {Auth | null}
	 */
	static instance = null;

	/**
	 * @type {BasicAuth}
	 */
	#basicAuth = BasicAuth;

	/**
	 * @type {PasswordBasedAuth}
	 */
	#passwordBasedAuth = PasswordBasedAuth;

	/**
	 * @type {JWT}
	 */
	#jwt = null

	/**
	 * @type {MFA}
	 */
	#mfa = null

	/**
	 * Constructor for Auth class.
	 * @param {ConfigType} [config=null] Configuration object for the authentication system. If not provided, the default `configType` will be used.
	 */
	constructor(config = null) {
		this.config = config ?? configType;
		this.#jwt = new JWT(this.config.tokenBasedToken);
		this.#mfa = new MFA(this.config.mfa);
	}

	/**
	 * Initializes the Auth instance (Singleton pattern).
	 * @param {ConfigType} [config=null] Configuration object for the authentication system.
	 * @returns {Auth} The Auth instance.
	 */
	static init(config = null) {
		if (null === Auth.instance) {
			Auth.instance = new Auth(config);
		}
		return Auth.instance;
	}

	/**
	 * Gets the Auth instance. Throws an error if the instance hasn't been initialized.
	 * @returns {Auth} The Auth instance.
	 * @throws {Error} If Auth hasn't been initialized.
	 */
	static getAuth() {
		if (!Auth.instance) {
			throw new Error("Auth hasn't been initialized!");
		}
		return Auth.instance;
	}

	/**
	 * Gets the BasicAuth module.
	 * @returns {BasicAuth} The BasicAuth module.
	 */
	getBasicAuth() {
		return this.#basicAuth;
	}

	/**
	 * Gets the PasswordBasedAuth module.
	 * @returns {PasswordBasedAuth} The PasswordBasedAuth module.
	 */
	getPasswordBasedAuth() {
		return this.#passwordBasedAuth
	}

	/**
	 * Gets the JWT module.
	 * @returns {JWT} The JWT module.
	 */
	getJWT() {
		return this.#jwt
	}

	/**
	 * Gets the MFA module.
	 * @returns {MFA} The MFA module.
	 */
	getMFA() {
		return this.#mfa
	}

	/**
	 * Verifies the provided comparison data against the original data using password-based authentication.
	 * @param {Object} originalData The original data to compare against.
	 * @param {Object} comparisonData The comparison data.
	 * @param {string} [returnType='bool'] The return type ('bool' or 'token').
	 * @returns {Promise<boolean|Object>} `true` if verification is successful, or an object containing tokens if `returnType` is 'token'.
	 */
	async verifyWithPassword(originalData, comparisonData, returnType = 'bool') {
		const verify = await PasswordBasedAuth.check(originalData, comparisonData, this.config.accessPassword)
		if (!verify) {
			return verify
		}
		switch (returnType) {
			case RETURN_TYPE.JWT.TOKEN:
				let result = {}
				let dataEncode = _.pick(originalData, this.config.tokenBasedToken.fields)
				if (this.config.tokenBasedToken?.refreshToken && this.config.tokenBasedToken?.refreshToken?.use) {
					result.refreshToken = await this.#jwt.generateRefreshToken(dataEncode)
					dataEncode.refreshToken = result.refreshToken
				}

				result.accessToken = await this.#jwt.generateAccessToken(dataEncode)
				return result
			case RETURN_TYPE.JWT.BOOL:
			default:
				return verify
		}
	}

	/**
	 * Hashes a password using bcrypt.
	 * @param {string} password The password to hash.
	 * @param {number} [saltRounds=10] The number of salt rounds to use.
	 * @returns {Promise<string>} The hashed password.
	 */
	async hashPassword(password, saltRounds = 10) {
		return await PasswordBasedAuth.hashPin(password, saltRounds);
	}

	/**
	 * Verifies the provided authorization header against the original data using basic authentication.
	 * @param {Object} originalData The original data to compare against.
	 * @param {string} authorizationHeader The authorization header.
	 * @returns {Promise<boolean>} `true` if verification is successful, `false` otherwise.
	 */
	async verifyWithBasicAuth(originalData, authorizationHeader) {
		return BasicAuth.check(originalData, authorizationHeader, this.config.accessPassword)
	}

	/**
	 * Generates MFA (Multi-Factor Authentication) secret and URL.
	 * @param {Object} originalData The original data containing user information.
	 * @param {string} [returnType='secret'] The return type ('secret', 'url', or 'qr').
	 * @returns {Promise<string|Object>} The MFA secret, URL, or QR code data.
	 */
	async generateMFA(originalData, returnType = 'secret') {
		const secretKey = this.#mfa.generateSecretKey()
		const id = originalData[this.config.mfa.fieldId]
		const url = this.#mfa.generateUrlWithSecret(id, secretKey)
		switch (returnType) {
			case RETURN_TYPE.MFA.URL:
				return url
			case RETURN_TYPE.MFA.ORCODE:
				return await this.#mfa.generateQRCode(url);
			case RETURN_TYPE.MFA.SECRET:
			default:
				return String(secretKey)
		}
	}

	/**
	 * Generates an OTP (One-Time Password) from a secret.
	 * @param {string} secret The secret key.
	 * @returns {string} The generated OTP.
	 */
	generateOTP(secret) {
		return this.#mfa.generateToken(secret);
	}
}

// Export Auth class, configType object, and RETURN_TYPE constant
module.exports = {
	Auth,
	configType,
	RETURN_TYPE
};
