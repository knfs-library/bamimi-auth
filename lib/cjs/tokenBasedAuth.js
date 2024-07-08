const jwt = require('jsonwebtoken');
const MemoryCache = require('node-cache');
const Redis = require("ioredis")

const PREFIX_BLACKLIST = 'Bamimi_blacklist_token__'
const PREFIX_REFRESH_TOKEN = 'Bamimi_refresh_token__'

const storageTypeEnum = {
	MEMORY: "memory",
	REDIS: "Redis"
}

let configType = {
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
		/**
		 * @type {Enum("memory", "redis")}
		 */
		type: "memory",
		options: {}
	}
}

class JWT {
	/**
	 * 
	 * @param {configType} config 
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
				type: storageTypeEnum.MEMORY
			}
		} else {
			this.storage = new Redis(this.config.storage?.options ?? {})
			this.config.storage = {
				type: storageTypeEnum.REDIS
			}
		}
	}


	/**
	 * 
	 * @param {*} payload 
	 * @returns 
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

	async #saveRefreshToken(token, ttl = null) {
		switch (this.config.storage.type) {
			case storageTypeEnum.REDIS:
				await this.#saveRefreshTokenToRedis(token, ttl)
			case storageTypeEnum.MEMORY:
				await this.#saveRefreshTokenToMemory(token, ttl)
		}
	}

	async #saveRefreshTokenToRedis(token, ttl) {
		this.#setValueToHashRedis(PREFIX_REFRESH_TOKEN, token, ttl)
	}

	async #saveRefreshTokenToMemory(token, ttl) {
		return await this.storage.set(this.#genKeyRefreshToken(token), true, ttl)
	}

	async getSavedRefreshToken(token) {
		switch (this.config.storage.type) {
			case storageTypeEnum.REDIS:
				await this.#getRefreshTokenFromRedis(token)
			case storageTypeEnum.MEMORY:
				await this.#getRefreshTokenFromMemory(token)
		}
	}

	/**
	 * 
	 * @param {String} token 
	 * @returns 
	 */
	async #getRefreshTokenFromMemory(token) {
		return this.storage.has(this.#genKeyRefreshToken(token))
	}

	/**
	 * 
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

		if (this.config.refreshToken?.use && (!data.refreshToken || "" === !data.refreshToken)) {
			throw new Error("Cannot find refresh token although you have config it!");
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
	 * 
	 * @param {String} token 
	 * @returns 
	 */
	async #getBlacklistWithMemory(token) {
		return this.storage.has(this.genKeyBlackList(token))
	}

	/**
	 * 
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
			case storageTypeEnum.MEMORY:
				await this.#setBlacklistWithMemory(token, ttl)
		}

		return  true
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
		}
	}

	/**
	 * 
	 */
	async closeConnection() {
		if (storageTypeEnum.REDIS === this.config.storage.type) {
			this.storage.quit()
		}
	}

	async #getValueFromHashRedis(groupName, key) {
		return await this.storage.hget(groupName, key);
	}

	async #setValueToHashRedis(groupName, token, ttl) {
		await this.storage.hset(groupName, token, true);
		if (ttl) {
			await this.storage.expire(`${groupName}:${token}`, ttl)
		}
	}
}

module.exports = {
	JWT,
	configType,
	storageTypeEnum
};
