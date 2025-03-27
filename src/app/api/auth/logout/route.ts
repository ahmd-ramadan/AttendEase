import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { IUser } from '@/interfaces';
import dbConnect from '@/lib/dbConnection';
import Token from '@/models/Token';


export async function POST(request: NextRequest) {
  // Connect to the database
  await dbConnect();

  try {
    //! Get user
    const user: IUser | null = await User.findById(request?.user?._id);

    let response: NextResponse;
    if (!user) {
      response = NextResponse.json(
          { 
              success: false, 
              msg: 'المستخدم غير موجود'
          },
          { status: 404 }
      );
    } else {

      const { userId }: { userId: string } = await request.json();
      //! Delete token from database
      await Token.deleteOne({ userId });

      response = NextResponse.json(
        { 
          success: true, 
          msg: "تم تسجيل الخروج بنجاح",
          data: { name: user.name, email: user.email, role: user.role }
        },
        { status: 200 }
      );
    }

    // Delete the JWT cookie by setting an expired one
    response.headers.set('Set-Cookie', 'jwt=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');

    return response;

  } catch (error) {
    console.error('Error logging out user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
