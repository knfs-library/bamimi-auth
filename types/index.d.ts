import { BasicAuthOptions } from "./basicAuth";

export type StorageTypeEnum = 'memory' | 'redis';

export interface StorageType {
    type: StorageTypeEnum;
    options: any;
}

export interface ConfigType {
    accessPassword: {
        idFields: string[];
        pinField: string;
    };
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
        storage: StorageType;
        fields: string[];
    };
    mfa: {
        appName: string;
        fieldId: string;
    };
}

export interface Auth {
    config: ConfigType;
    getBasicAuth(): any;
    getPasswordBasedAuth(): any;
    getJWT(): any;
    getMFA(): any;
    verifyWithPassword(originalData: any, comparisonData: any, returnType?: string): Promise<boolean | any>;
    hashPassword(password: string, saltRounds?: number): Promise<string>;
    verifyWithBasicAuth(originalData: any, authorizationHeader: string): Promise<boolean>;
    generateMFA(originalData: any, returnType?: string): Promise<string | any>;
    generateOTP(secret: string): string;
}

export declare const RETURN_TYPE: {
    JWT: {
        BOOL: string;
        TOKEN: string;
    };
    MFA: {
        SECRET: string;
        URL: string;
        ORCODE: string;
    };
};
export declare const configType: ConfigType;
export declare class Auth {
    constructor(config?: ConfigType);
    static init(config?: ConfigType): Auth;
    static getAuth(): Auth;
    getBasicAuth(): any;
    getPasswordBasedAuth(): any;
    getJWT(): any;
    getMFA(): any;
    verifyWithPassword(originalData: any, comparisonData: any, returnType?: string): Promise<boolean | any>;
    hashPassword(password: string, saltRounds?: number): Promise<string>;
    verifyWithBasicAuth(originalData: any, authorizationHeader: string): Promise<boolean>;
    generateMFA(originalData: any, returnType?: string): Promise<string | any>;
    generateOTP(secret: string): string;
}
