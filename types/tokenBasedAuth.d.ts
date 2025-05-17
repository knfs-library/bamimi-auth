import { RedisOptions } from "ioredis";
import { Options } from "node-cache";

export type StorageTypeEnum = 'memory' | 'redis';

export interface StorageType {
    type: StorageTypeEnum;
    options?: RedisOptions | Options;
}

export interface ConfigType {
    accessToken: {
        secretKey: string;
        options?: object;
    };
    refreshToken: {
        secretKey: string;
        options?: object;
        multiple: boolean;
        use: boolean;
    };
    useBlacklist: boolean;
    storage: StorageType;
}

export declare class JWT {
    private config: ConfigType;
    private storage: any;
    constructor(config: ConfigType);
    generateRefreshToken(data: any): Promise<string>;
    private saveRefreshToken(token: string, ttl?: number): Promise<void>;
    private saveRefreshTokenToRedis(token: string, ttl: number): Promise<void>;
    private saveRefreshTokenToMemory(token: string, ttl: number): Promise<void>;
    getSavedRefreshToken(token: string): Promise<boolean>;
    private getRefreshTokenFromMemory(token: string): Promise<boolean>;
    private getRefreshTokenFromRedis(token: string): Promise<string | null>;
    private genKeyRefreshToken(token: string): string;
    generateAccessToken(data: any, options: any): Promise<string>;
    verify(token: string, isRefreshToken?: boolean): Promise<any>;
    genKeyBlackList(token: string): Promise<string>;
    private setBlacklistWithMemory(token: string, ttl: number): Promise<void>;
    private setBlacklistWithRedis(token: string, ttl: number): Promise<void>;
    private getBlacklistWithMemory(token: string): Promise<boolean>;
    private getBlacklistWithRedis(token: string): Promise<string | null>;
    setBlacklist(token: string): Promise<boolean>;
    checkBlacklist(token: string): Promise<boolean>;
    closeConnection(): Promise<void>;
    private getValueFromHashRedis(groupName: string, key: string): Promise<string | null>;
    private setValueToHashRedis(groupName: string, token: string, ttl: number): Promise<void>;
}
export declare const storageTypeEnum: {
    MEMORY: string;
    REDIS: string;
};
