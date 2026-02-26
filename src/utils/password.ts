import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const result = await bcrypt.hash(password, salt);
    return result;
}

export async function verifyPassword(
    password: string,
    hash: string,
): Promise<boolean> {
    if (!password || !hash) {
        throw new Error("passwrod or hash missing for verification");
    }

    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}
