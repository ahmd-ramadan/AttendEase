import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import Token, { IToken } from "@/models/Token";
import { ITokenPayload } from "@/utils/auth";
import User, { UserRolesEnum } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

declare module 'next/server' {
  interface NextRequest {
    user?: { 
      email: string;
      name: string;
      role: string;
      _id?: string;
      token?: string;
    };
  }
}

// Middleware to verify authentication
export async function authenticate({
    request, 
    allowedRoles = []
}: { 
    request: NextRequest;
    allowedRoles: UserRolesEnum[]
}) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('jwt')?.value;

    if (!token) {
      // Token is missing, user is not authenticated
      return NextResponse.json(
        { success: false, msg: "Authentication required" },
        { status: 401 }  // Unauthorized
      );
    }

    // Verify the token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    //! verify that user login or in database
    const isUserLoggedIn = await Token.findById(decoded?.tokenId);
    if (!isUserLoggedIn) {
        return NextResponse.json(
            { success: false, msg: "سجل الدخول مرة أخري" },
            { status: 401 }  // Unauthorized
        );
    }

    //! get User 
    const user = await User.findOne({ email:  decoded?.email }).select("-password");

    //! Check is user have access/authorized
    if (allowedRoles.length && !allowedRoles.some(role => user.role === role)) {
        return NextResponse.json(
            { success: false, msg: "غير مسموح لك بفعل هذا" },
            { status: 401 }  // Unauthorized
        );
    }

    // If the token is valid, attach user data to the request (optional)
    request.user = user;

    // Proceed to the next handler
    return true;
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, msg: "Invalid or expired token" },
      { status: 401 }  // Unauthorized
    );
  }
}
