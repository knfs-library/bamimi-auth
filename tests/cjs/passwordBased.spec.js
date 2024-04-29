const { check, hashPin } = require("../../lib/cjs/passwordBasedAuth")
const { faker } = require("@faker-js/faker");

describe("Password Base check function", () => {
	const password = faker.internet.password(8)
	const originalData = {
		username: faker.internet.userName(),
		email: faker.internet.email(),
	}

	let verifyData = {}

	beforeAll(async () => {
		originalData.password = await hashPin(password)
	})

	beforeEach(async () => {
		verifyData = { password: password }
	})


	test("Wrong Password and use Username", async () => {
		verifyData = {
			id: originalData.username,
			password: "abcaaaaaa"
		}

		return await check(
			originalData,
			verifyData, {
			idFields: ["username"],
			pinField: "password"
		}).then(async (result) => await expect(result).toBe(false))
	})


	test("Wrong Password and use email", async () => {
		verifyData = {
			id: originalData.email,
			password: "abcaaaaaa"
		}

		return await check(
			originalData,
			verifyData, {
			idFields: ["email"],
			pinField: "password"
		}).then(async (result) => await expect(result).toBe(false))
	})


	test("True Password but not find id is username", async () => {
		verifyData = {
			id: faker.internet.userName(),
			password
		}

		return await check(
			originalData,
			verifyData, {
			idFields: ["username"],
			pinField: "password"
		}).then(async (result) => await expect(result).toBe(false))
	})


	test("True Password but not find it is email", async () => {
		verifyData = {
			id: faker.internet.email(),
			password
		}
		return await check(
			originalData,
			verifyData, {
			idFields: ["email"],
			pinField: "password"
		}).then(async (result) => await expect(result).toBe(false))
	})


	test("True Password and true email and use verify username and email", async () => {
		verifyData = {
			id: originalData.email,
			password
		}
		return await check(
			originalData,
			verifyData, {
			idFields: ["email", "username"],
			pinField: "password"
		}).then(async (result) => await expect(result).toBe(true))
	})


	test("True Password and true username and use verify username and email", async () => {
		verifyData = {
			id: originalData.username,
			password
		}
		return await check(
			originalData,
			verifyData, {
			idFields: ["email", "username"],
			pinField: "password"
		}).then(async (result) => await expect(result).toBe(true))
	})
})