
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';

export function PasswordHasher(pwd : string) : string {
    const salt = genSaltSync(10);
    return hashSync(pwd, salt);
} 

export function VerifyPassword (pwd : string, hashedPwd : string ) : boolean {
    return compareSync(pwd, hashedPwd);
}