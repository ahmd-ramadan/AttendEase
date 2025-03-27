import { UserRolesEnum } from "@/enums";
import { JWTPayload } from "jose";
import { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: UserRolesEnum;
}


export interface IToken extends Document {
    userId: string;
    createdAt: Date;
}

export interface ITokenPayload extends JWTPayload {
    tokenId: string;
    userId: string;
    email: string;
    name: string;
    role: UserRolesEnum;
}

export interface ICourse {
    _id: string;
    title: string;
    students: IUser[];
    createdAt: string,
    doctorId: IUser,
    sessions?: ISession[]
}

export interface ISession extends Document {
    _id: string;
    title: string;
    startAt: string;
    endAt: string;
    createdAt: string;
    doctorId: IUser;
    courseId: ICourse;
    students: IUser[],
}

export interface ILocation {
    latitude: number;
    longitude: number;
}

export interface IFingerprint  extends Document {
    _id: string;
    visitorId: string;
    userId: IUser;
}

export interface INavList {
    name: string;
    link: string;
}