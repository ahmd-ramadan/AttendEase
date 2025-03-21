import { UserRolesEnum } from "@/models/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const generateSalt = async () => {
    return await bcrypt.genSalt(10);
};

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const validatePassword = async (enteredPassword: string, savedPassword: string) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
};

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRES_TIME = process.env.TOKEN_EXPIRES_TIME as string;

export interface ITokenPayload {
    tokenId: string,
    email: string,
    name: string,
    role:UserRolesEnum
}

export const generateToken = async (payload: ITokenPayload, expires: string = TOKEN_EXPIRES_TIME) => {
    if (!JWT_SECRET) {
        throw new Error("JWT secret key is not defined in environment variables.");
    }

    try {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expires });
        return token;
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Failed to generate token.");
    }
};
