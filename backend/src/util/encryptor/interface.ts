export interface IEncryptor {
    hash (plainPassword: string): Promise<string>;
    compare (loginPassword: string, storedHash: string): Promise<boolean>;
}
