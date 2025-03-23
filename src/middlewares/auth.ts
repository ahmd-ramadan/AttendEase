import { NextResponse, NextRequest } from "next/server";
import Token from "@/models/Token";
import User, { UserRolesEnum } from "@/models/User";
import { verifyToken } from "@/utils/token";

declare module "next/server" {
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
  allowedRoles = [],
}: {
  request: NextRequest;
  allowedRoles: UserRolesEnum[];
}) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("jwt")?.value;
    // console.log("token: ", token);

    if (!token) {
      return NextResponse.json(
        { success: false, msg: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    // console.log("Decoded token: ", decoded);

    if (!decoded || !decoded.tokenId) {
      return NextResponse.json(
        { success: false, msg: "سجل الدخول مرة أخري" },
        { status: 401 }
      );
    }

    //! Verify that user login or in database
    const isUserLoggedIn = await Token.findById(decoded.tokenId);
    if (!isUserLoggedIn) {
      return NextResponse.json(
        { success: false, msg: "سجل الدخول مرة أخري" },
        { status: 401 }
      );
    }

    //! Get user from database
    const user = await User.findOne({ email: decoded.email }).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, msg: "المستخدم غير موجود" },
        { status: 401 }
      );
    }

    //! Check if user is authorized
    // console.log("Auth User: ", user)
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, msg: "غير مسموح لك بفعل هذا" },
        { status: 401 }
      );
    }

    // Attach user data to the request
    (request as any).user = user;

    return true;
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, msg: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
