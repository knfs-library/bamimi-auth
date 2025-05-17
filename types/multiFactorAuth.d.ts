/**
 * Configuration options for the MFA class.
 */
export interface MFAConfig {
    /**
     * The name of the application using MFA. This is displayed in the authenticator app.
     */
    appName: string;
}

/**
 * Class for handling Multi-Factor Authentication (MFA) functionalities.
 */
export declare class MFA {
    /**
     * @private
     */
    config: MFAConfig;
    /**
     * Constructor for the MFA class.
     * @param config Configuration object for the MFA.
     */
    constructor(config: MFAConfig);
    /**
     * Generates a secret key for MFA.
     * @returns The generated secret key.
     */
    generateSecretKey(): string;
    /**
     * Generates a token based on the provided secret.
     * @param secret The secret key used to generate the token.
     * @returns The generated token.
     */
    generateToken(secret: string): string;
    /**
     * Generates a URL with the secret key for setting up MFA in an authenticator app.
     * @param id The user ID or account name.
     * @param secret The secret key.
     * @returns The generated URL.
     * @throws If `appName` is not configured in the constructor.
     */
    generateUrlWithSecret(id: string, secret: string): string;
    /**
     * Checks if the provided token is valid for the given secret.
     * @param token The token to check.
     * @param secret The secret key to validate the token against.
     * @returns `true` if the token is valid, `false` otherwise.
     */
    check(token: string, secret: string): boolean;
    /**
     * Generates a QR code for the provided URL.
     * @param url The URL to encode in the QR code.
     * @returns An object containing the base64 encoded data and an HTML image tag for the QR code.
     */
    generateQRCode(url: string): Promise<{
        baseData: string;
        image: string;
    }>;
}
