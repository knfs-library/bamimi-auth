// @ts-nocheck
// @ts-ignore
const jwt = require('jsonwebtoken');
const MemoryCache = require('node-cache');
const Redis = require("ioredis")

const PREFIX_BLACKLIST = 'Bamimi_blacklist_token__'
const PREFIX_REFRESH_TOKEN = 'Bamimi_refresh_token__'

/**
 * @module tokenBasedAuth
 */

/**
 * @typedef {'memory' | 'redis'} StorageTypeEnum
 */

/**
 * @readonly
 * @enum {string}
 */
const storageTypeEnum = {
	MEMORY: "memory",
	REDIS: "redis"
}

/**
 * @typedef {Object} storageType
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
class JWT {
	/**
	 * Constructor for the JWT class.
	 * @param {configType} config Configuration object for JWT.
	 */
	constructor(config) {
		this.config = config
		if (
			!this.config.storage
			||
			!this.config.storage?.type
			||
			storageTypeEnum.MEMORY === this.config.storage?.type
		) {
			this.storage = new MemoryCache(this.config.storage?.options ?? {})
			this.config.storage = {
				// @ts-ignore
				type: storageTypeEnum.MEMORY,
				options: this.config.storage?.options ?? {}
			}
		} else {
			// @ts-ignore
			this.storage = new Redis(this.config.storage?.options ?? {})
			this.config.storage = {
				// @ts-ignore
				type: storageTypeEnum.REDIS,
				options: this.config.storage?.options ?? {}
			}
		}
	}


	/**
	 * Generates a refresh token.
	 * @param {*} data The data to include in the refresh token payload.
	 * @returns {Promise<string>} The generated refresh token.
	 * @throws {Error} If refresh token configuration is missing.
	 */
	async generateRefreshToken(data) {
		if (!this.config.refreshToken) {
			throw new Error("Cannot find refresh token config!");
		}
		const secretKey = this.config.refreshToken.secretKey ?? ""
		const options = this.config.refreshToken.options ?? {}

		const token = jwt.sign(data, secretKey, options)

		if (this.config.refreshToken.multiple && token) {
			await this.#saveRefreshToken(token, options.expiresIn)
		}

		return token
	}

	/**
	 * Saves a refresh token to storage.
	 * @private
	 * @param {string} token The refresh token to save.
	 * @param {number} ttl Time to live (expiration time) in seconds.
	 */
	async #saveRefreshToken(token, ttl = null) {
		switch (this.config.storage.type) {
			case storageTypeEnum.REDIS:
				await this.#saveRefreshTokenToRedis(token, ttl)
				break; // Added break statement
			case storageTypeEnum.MEMORY:
				await this.#saveRefreshTokenToMemory(token, ttl)
				break; // Added break statement
		}
	}

	/**
	 * Saves a refresh token to Redis.
	 * @private
	 * @param {string} token The refresh token to save.
	 * @param {number} ttl Time to live (expiration time) in seconds.
	 */
	async #saveRefreshTokenToRedis(token, ttl) {
		await this.#setValueToHashRedis(PREFIX_REFRESH_TOKEN, token, ttl)
	}

	/**
	 * Saves a refresh token to memory.
	 * @private
	 * @param {string} token The refresh token to save.
	 * @param {number} ttl Time to live (expiration time) in seconds.
	 */
	async #saveRefreshTokenToMemory(token, ttl) {
		return await this.storage.set(this.#genKeyRefreshToken(token), true, ttl)
	}

	/**
	 * Retrieves a saved refresh token from storage.
	 * @param {string} token The refresh token to retrieve.
	 * @returns {Promise<boolean>} True if the token exists, false otherwise.
	 */
	async getSavedRefreshToken(token) {
		switch (this.config.storage.type) {
			case storageTypeEnum.REDIS:
				return await this.#getRefreshTokenFromRedis(token) // Corrected: Added return
			case storageTypeEnum.MEMORY:
				return await this.#getRefreshTokenFromMemory(token) // Corrected: Added return
			default:
				return false; // Added default case to handle unknown storage types
		}
	}


	/**
	 * @private
	 * @param {String} token
	 * @returns
	 */
	async #getRefreshTokenFromMemory(token) {
		return this.storage.has(this.#genKeyRefreshToken(token))
	}

	/**
	 * @private
	 * @param {String} token
	 * @returns
	 */
	async #getRefreshTokenFromRedis(token) {
		return this.#getValueFromHashRedis(PREFIX_REFRESH_TOKEN, token);
	}

	/**
	 *
	 * @param {String} token
	 * @returns
	 */
	#genKeyRefreshToken(token) {
		return PREFIX_REFRESH_TOKEN + token;
	}

	/**
	 *
	 * @param {*} data
	 * @param {*} options
	 * @returns
	 */
	async generateAccessToken(data) {
		if (!this.config.accessToken) {
			throw new Error("Cannot find access token config!");
		}

		const secretKey = this.config.accessToken.secretKey ?? ""
		const options = this.config.accessToken.options ?? {}

		return jwt.sign(data, secretKey, options)
	}
	/**
	 *
	 * @param {String} token
	 * @param {Boolean} isRefreshToken
	 * @returns
	 */
	async verify(token, isRefreshToken = false) {
		const secretKey = isRefreshToken
			? this.config.refreshToken.secretKey
			: this.config.accessToken.secretKey;

		return await jwt.verify(token, secretKey);
	}

	/**
	 *
	 * @param {String} token
	 * @returns
	 */
	async genKeyBlackList(token) {
		return PREFIX_BLACKLIST + token;
	}

	/**
	 *
	 * @param {String} token
	 * @param {time} ttl
	 * @returns
	 */
	async #setBlacklistWithMemory(token, ttl) {
		this.storage.set(this.genKeyBlackList(token), true, ttl)
	}

	/**
	 *
	 * @param {String} token
	 * @param {time} ttl
	 * @returns
	 */
	async #setBlacklistWithRedis(token, ttl) {
		this.#setValueToHashRedis(PREFIX_BLACKLIST, token, ttl)
	}

	/**
	 * @private
	 * @param {String} token
	 * @returns
	 */
	async #getBlacklistWithMemory(token) {
		return this.storage.has(this.genKeyBlackList(token))
	}

	/**
	 * @private
	 * @param {String} token
	 * @returns
	 */
	async #getBlacklistWithRedis(token) {
		return this.#getValueFromHashRedis(PREFIX_BLACKLIST, token);
	}

	/**
	 *
	 * @param {String} token
	 * @returns
	 */
	async setBlacklist(token) {
		if (!this.config.useBlacklist) {
			throw new Error("Cannot find black list config!");
		}

		const decodedToken = jwt.decode(token, { complete: true });
		if (!decodedToken) {
			throw new Error("Invalid token format!");
		}
		const expTime = decodedToken.payload.exp;
		const currentTime = Math.floor(Date.now() / 1000);
		const ttl = expTime - currentTime;
		switch (this.config.storage.type) {
			case storageTypeEnum.REDIS:
				await this.#setBlacklistWithRedis(token, ttl)
				break; // Added break statement
			case storageTypeEnum.MEMORY:
				await this.#setBlacklistWithMemory(token, ttl)
				break; // Added break statement
		}

		return true
	}

	/**
	 *
	 * @param {String} token
	 * @returns
	 */
	async checkBlacklist(token) {
		switch (this.config.storage.type) {
			case storageTypeEnum.REDIS:
				return await this.#getBlacklistWithRedis(token)
			case storageTypeEnum.MEMORY:
				return await this.#getBlacklistWithMemory(token)
			default:
				return false; // Added default case to handle unknown storage types
		}
	}

	/**
	 * Closes the connection to the storage (e.g., Redis).
	 */
	async closeConnection() {
		if (storageTypeEnum.REDIS === this.config.storage.type) {
			this.storage.quit()
		}
	}

	/**
	 *
	 * @param {string} groupName
	 * @param {string} key
	 * @returns
	 */
	async #getValueFromHashRedis(groupName, key) {
		return await this.storage.hget(groupName, key);
	}

	/**
	 * @private
	 * @param {string} groupName
	 * @param {string} token
	 * @param {number} ttl
	 * @returns
	 */
	async #setValueToHashRedis(groupName, token, ttl) {
		await this.storage.hset(groupName, token, true);
		if (ttl) {
			await this.storage.expire(token, ttl)
		}
	}
}

module.exports = {
	JWT,
	storageTypeEnum
};
