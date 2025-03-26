import { NextRequest, NextResponse } from 'next/server';
import User, { IUser, UserRolesEnum } from '@/models/User';
import dbConnect from '@/lib/dbConnection';
import Token from '@/models/Token';
import { authenticate } from '@/middlewares/auth';

export async function POST(request: NextRequest) {
    // First, authenticate the user before proceeding
    const authResponse = await authenticate({
        request, 
        allowedRoles: [UserRolesEnum.student, UserRolesEnum.doctor, UserRolesEnum.admin]
    });
    if (authResponse !== true) {
        // If authentication failed, return early
        return authResponse;
    }

    // Connect to the database
    await dbConnect();

  try {
    
    //! Get user
    const user: IUser | null = await User.findById(request?.user?._id);
    
    let response: any = null;
    if (!user) {
      response = NextResponse.json(
        { 
          success: false, 
          msg: 'المستخدم غير موجود'
        },
        { status: 404 }
      );
    } else {

      //! Delete token from database
      const tokenDatabase = await Token.deleteOne({ userId: request?.user?._id });
      response = NextResponse.json(
        { 
          success: true, 
          msg: "تم تسجيل الخروج بنجاح",  // Changed message to "Logged out successfully"
          data: { name: user.name, email: user.email, role: user.role }
        },
        { status: 200 }
      );
    }

    // Delete the JWT cookie in the response headers
    response.headers.delete('jwt');

    return response;

  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}