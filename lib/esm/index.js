// Import necessary modules
import { MFA } from "./multiFactorAuth.js";
import BasicAuth from "./basicAuth.js";
import PasswordBasedAuth from "./passwordBasedAuth.js";
import { configType as tokenBasedConfigType, JWT } from "./tokenBasedAuth.js";
import _ from 'lodash';

// Define constants for return types
const RETURN_TYPE = {
	JWT: {
		BOOL: 'bool',
		TOKEN: 'token'
	},
	MFA: {
		SECRET: 'secret',
		URL: 'url',
		ORCODE: 'qr'
	}
}

// Define configType object
const configType = {
	accessPassword: {
		idFields: ['username'],
		pinField: ['password']
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
		},
		useBlacklist: false,
		storage: {
			/**
			 * @type {Enum("memory", "redis")}
			 */
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

// Class Auth defines authentication system
class Auth {
	// Static variable to hold the instance of Auth class
	static instance = null;

	/**
	 * @type {PasswordBasedAuth}
	 */
	#passwordBasedAuth = null

	/**
	 * @type {JWT}
	 */
	#jwt = null

	/**
	 * @type {BasicAuth}
	 */
	#basicAuth = null

	/**
	 * @type {MFA}
	 */
	#mfa = null

	// Constructor for Auth class
	constructor(config = null) {
		this.config = config ?? configType; // Set config to default if not provided
		this.#basicAuth = BasicAuth;
		this.#passwordBasedAuth = PasswordBasedAuth;
		this.#jwt = new JWT(this.config.tokenBasedToken);
		this.#mfa = new MFA(this.config.mfa);
	}

	/**
	 * 
	 * @param {*} config 
	 * @returns {Auth}
	 */
	// Static method to initialize Auth instance
	static init(config = null) {
		if (null === Auth.instance) {
			Auth.instance = new Auth(config);
		}
		return Auth.instance;
	}

	// Static method to get Auth instance
	static getAuth() {
		if (!Auth.instance) {
			throw new Error("Auth hasn't been initialized!");
		}
		return Auth.instance;
	}

	getBasicAuth() {
		return this.#basicAuth;
	}

	getPasswordBasedAuth() {
		return this.#passwordBasedAuth
	}

	getJWT() {
		return this.#jwt
	}

	getMFA() {
		return this.#mfa
	}

	// Method to verify password
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

	// Method to hash password
	async hashPassword(password, saltRounds = 10) {
		return await PasswordBasedAuth.hashPin(password, saltRounds);
	}

	// Method to verify with Basic Auth
	async verifyWithBasicAuth(originalData, authorizationHeader) {
		return BasicAuth.check(originalData, authorizationHeader, this.config.accessPassword)
	}

	// Method to generate MFA
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
				console.log(secretKey)
				return String(secretKey)
		}
	}

	// Method to generate OTP
	async generateOTP(secret) {
		return this.#mfa.generateToken(secret);
	}
}

// Export Auth class, configType object, and RETURN_TYPE constant
export {
	Auth,
	configType,
	RETURN_TYPE
};
