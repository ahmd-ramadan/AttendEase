import { jwtVerify, SignJWT } from "jose";
import { UserRolesEnum } from "@/models/User";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;
const TOKEN_EXPIRES_TIME = process.env.NEXT_PUBLIC_TOKEN_EXPIRES_TIME || "30d";

export interface ITokenPayload {
    tokenId: string;
    userId: string;
    email: string;
    name: string;
    role: UserRolesEnum;
}

// export const generateToken = async (payload: ITokenPayload, expires: string = TOKEN_EXPIRES_TIME): Promise<string> => {
//     if (!JWT_SECRET) {
//         throw new Error("JWT secret key is not defined in environment variables.");
//     }

//     try {
//         return jwt.sign(payload, JWT_SECRET, { expiresIn: expires });
//     } catch (error) {
//         console.error("Error generating JWT:", error);
//         throw new Error("Failed to generate token.");
//     }
// };

// export const verifyToken = async (token: string) => {
//     try {
//         return jwt.verify(token, JWT_SECRET);
//     } catch (error: any) {
//         console.error("Error verifying JWT:", error);

//         if (error.name === "TokenExpiredError") {
//             throw new Error("Token expired.");
//         } else if (error.name === "JsonWebTokenError") {
//             throw new Error("Invalid token.");
//         } else {
//             throw new Error("Failed to verify token.");
//         }
//     }
// };

export const generateToken = async (payload: ITokenPayload, expiresIn: string = TOKEN_EXPIRES_TIME) => {
    if (!JWT_SECRET) {
        throw new Error("JWT secret key is not defined in environment variables.");
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(expiresIn) 
            .sign(secret);

        return token;
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Failed to generate token.");
    }
};

export const verifyToken = async (token: string): Promise<ITokenPayload | null> => {
    if (!JWT_SECRET) {
        throw new Error("JWT secret key is not defined in environment variables.");
    }

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload }: { payload: ITokenPayload } = await jwtVerify(token, secret);
        // console.log("Payload: ", payload)
        return payload;
    } catch (error) {
        console.error("Error verifying JWT:", error);
        // throw new Error("Invalid or expired token.");
        return null;
    }
};

