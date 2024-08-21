const { JWT, storageTypeEnum } = require('./../../lib/cjs/tokenBasedAuth');
const { faker } = require("@faker-js/faker");
const MemoryCache = require('node-cache');
const Redis = require("ioredis");
const { multiply } = require('lodash');

jest.mock('ioredis')

Redis.prototype.setex = jest.fn().mockReturnValue(true);
Redis.prototype.hset = jest.fn().mockReturnValue(true);
Redis.prototype.hget = jest.fn().mockReturnValue(true);
Redis.prototype.expire = jest.fn().mockReturnValue(true);
Redis.prototype.exists = jest.fn();
Redis.prototype.quit = jest.fn();

jest.mock('node-cache')

MemoryCache.prototype.set = jest.fn().mockReturnValue(true);
MemoryCache.prototype.has = jest.fn().mockReturnValue(true);

describe('JWT class', () => {
	const data = {
		username: faker.internet.userName(),
		sub: faker.datatype.uuid()
	}

	test("generateRefreshToken error", async () => {
		const config = {
			accessToken: {
				secretKey: "",
				options: {
					expiresIn: '30s'
				}
			}
		}

		const jwt0 = new JWT(config)
		expect(jwt0.generateRefreshToken(data)).rejects.toThrowError("Cannot find refresh token config!");
	})

	test("generateRefreshToken with multiple and memory", async () => {
		const config = {
			accessToken: {
				secretKey: "",
				options: {
					expiresIn: '30s'
				}
			},
			refreshToken: {
				secretKey: "ABCC",
				options: {
					expiresIn: '1m'
				},
				multiple: true
			}
		}
		const jwt0 = new JWT(config)
		jwt0.generateRefreshToken(data)
		expect(MemoryCache.prototype.set).toBeCalled();
	})

	test("generateRefreshToken with multiple and redis", async () => {
		const config = {
			accessToken: {
				secretKey: "",
				options: {
					expiresIn: '30s'
				}
			},
			refreshToken: {
				secretKey: "ABCC",
				options: {
					expiresIn: '1m'
				},
				multiple: true
			},
			storage: {
				type: storageTypeEnum.REDIS,
				options: {}
			}
		}
		const jwt0 = new JWT(config)
		jwt0.generateRefreshToken(data)
		expect(Redis.prototype.hset).toBeCalled();
	})

	test("generateAccessToken error not config", async () => {
		const config = {}

		const jwt0 = new JWT(config)
		expect(jwt0.generateAccessToken(data)).rejects.toThrowError("Cannot find access token config!");
	})

	test('Set and check blacklist with MemoryCache', async () => {
		const config = {
			accessToken: {
				secretKey: "abcc",
				options: {
					expiresIn: '30s'
				}
			},
			useBlacklist: true,
		}

		const jwt0 = new JWT(config)
		const token = await jwt0.generateAccessToken(data)
		await jwt0.setBlacklist(token);
		const isBlacklisted = await jwt0.checkBlacklist(token);
		expect(isBlacklisted).toBe(true);
	});

	test('Set and check blacklist with redis', async () => {
		const config = {
			accessToken: {
				secretKey: "abcc",
				options: {
					expiresIn: '30s'
				}
			},
			useBlacklist: true,
			storage: {
				type: storageTypeEnum.REDIS,
				options: {}
			}
		}

		const jwt0 = new JWT(config)
		const token = await jwt0.generateAccessToken(data)
		await jwt0.setBlacklist(token);
		expect(Redis.prototype.hset).toBeCalled();
		const isBlacklisted = await jwt0.checkBlacklist(token);
		expect(isBlacklisted).toBe(true);
	});
});
