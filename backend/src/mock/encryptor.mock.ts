import { IEncryptor } from "util/encryptor/interface";


export default class Encryptor implements IEncryptor {
    private expectedCompareResult: boolean;

    constructor(expectedCompareResult: boolean) {
        this.expectedCompareResult = expectedCompareResult;
    }

    async hash(plainPassword: string): Promise<string> {
        return 'hashed-password';
    }

    async compare(loginPassword: string, storedHash: string): Promise<boolean> {
        return this.expectedCompareResult;
    }
}
