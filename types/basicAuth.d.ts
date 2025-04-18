/**
 * Authentication check function.
 *
 * @param {*} originalData
 * @param {Buffer | String} authorizationHeader
 * @param {{idFields?: Array<string>, pinField?: string}} fields
 *    @property {Array<string>} [idFields] - ...
 *    @property {string} [pinField] - ...
 * @returns {Promise<boolean>}
 */
export function check(originalData: any, authorizationHeader: Buffer | string, { idFields, pinField }: {
    idFields?: Array<string>;
    pinField?: string;
}): Promise<boolean>;
