const { authenticator } = require('otplib');
const qrcode = require('qrcode');

/**
 * @module multiFactorAuth
 */

/**
 * Class for handling Multi-Factor Authentication (MFA) functionalities.
 */
class MFA {
	/**
	 * Constructor for the MFA class.
	 * @param {Object} config Configuration object for the MFA.
	 * @param {string} config.appName The name of the application using MFA.  This is displayed in the authenticator app.
	 */
	constructor(config) {
		/**
		 * @private
		 */
		this.config = config;
	}

	/**
	 * Generates a secret key for MFA.
	 * @returns {string} The generated secret key.
	 */
	generateSecretKey() {
		return authenticator.generateSecret()
	}

	/**
	 * Generates a token based on the provided secret.
	 * @param {string} secret The secret key used to generate the token.
	 * @returns {string} The generated token.
	 */
	generateToken(secret) {
		return authenticator.generate(secret)
	}

	/**
	 * Generates a URL with the secret key for setting up MFA in an authenticator app.
	 * @param {string} id The user ID or account name.
	 * @param {string} secret The secret key.
	 * @returns {string} The generated URL.
	 * @throws {Error} If `appName` is not configured in the constructor.
	 */
	generateUrlWithSecret(id, secret) {
		if (!this.config.appName) {
			throw new Error("Cannot find app name");
		}

		return authenticator.keyuri(id, this.config.appName, secret);
	}

	/**
	 * Checks if the provided token is valid for the given secret.
	 * @param {string} token The token to check.
	 * @param {string} secret The secret key to validate the token against.
	 * @returns {boolean} `true` if the token is valid, `false` otherwise.
	 */
	check(token, secret) {
		return authenticator.check(token, secret)
	}

	/**
	 * Generates a QR code for the provided URL.
	 * @param {string} url The URL to encode in the QR code.
	 * @returns {Promise<{baseData: string, image: string}>} An object containing the base64 encoded data and an HTML image tag for the QR code.
	 */
	async generateQRCode(url) {
		const data = await qrcode.toDataURL(url);
		const image = `<image src="${data}" />`;
		return {
			baseData: data,
			image
		}
	}
}

module.exports = {
	MFA
}
