import { UserRolesEnum } from "@/models/User";
import bcrypt from "bcrypt"

export const generateSalt = async () => {
    return await bcrypt.genSalt(10);
};

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const validatePassword = async (enteredPassword: string, savedPassword: string) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
};

export const hasAccess = ({ requiredRoles, userRole, }: { requiredRoles: UserRolesEnum[], userRole: UserRolesEnum }): boolean => {
    return requiredRoles.includes(userRole);
}