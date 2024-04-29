import { authenticator } from 'otplib';
import qrcode from 'qrcode';

class MFA {
	constructor(config) {
		this.config = config;
	}

	generateSecretKey() {
		return authenticator.generateSecret();
	}

	generateToken(secret) {
		return authenticator.generate(secret);
	}

	generateUrlWithSecret(id, secret) {
		if (!this.config.appName) {
			throw new Error("Cannot find app name");
		}

		return authenticator.keyuri(id, this.config.appName, secret);
	}

	check(token, secret) {
		return authenticator.check(token, secret);
	}

	async generateQRCode(url) {
		const data = await qrcode.toDataURL(url);
		const image = `<image src="${data}" />`;
		return {
			baseData: data,
			image
		};
	}
}

export { MFA };
