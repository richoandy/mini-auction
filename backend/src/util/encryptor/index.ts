import bcrypt from 'bcrypt';
import { IEncryptor } from "./interface";

export default class Encryptor implements IEncryptor {
    private salt: number;
    private bcrypt: bcrypt;

    constructor(bcrypt: bcrypt, salt: number) {
        this.salt = salt;
        this.bcrypt = bcrypt;
    }

    async hash(plainPassword: string): Promise<string> {
        try {
            return this.bcrypt.hash(plainPassword, this.salt);
          } catch (error) {
            throw new Error('password hashing failed');
          }
    }

    async compare(loginPassword: string, storedHash: string): Promise<boolean> {
        try {
            return this.bcrypt.compare(loginPassword, storedHash);
        } catch (error) {
            throw new Error('password compare failed');
        }
    }
}