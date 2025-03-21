import { NextResponse } from 'next/server';
import User, { IUser, UserRolesEnum } from '@/models/User';
import dbConnect from '@/lib/dbConnection';
import { generateToken, validatePassword } from '@/utils/auth';
import Token from '@/models/Token';
import { serialize } from 'cookie';

interface UserRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    // Parse the request body and cast it to the UserRequestBody type
    const { email, password }: UserRequestBody = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          msg: 'برجاء أدخل جميع البيانات المطلوبة'
        },
        { status: 400 }
      );
    }

    //! Get user
    const user: IUser | null = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          msg: 'البريد الإلكتروني أو كلمة المرور غير صحيح'
        },
        { status: 400 }
      );
    }

    //! Validate password
    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { 
          success: false, 
          msg: 'البريد الإلكتروني أو كلمة المرور غير صحيح'
        },
        { status: 400 }
      );
    }

    //! Generate Token
    const tokenDatabase = await Token.create({ userId: user._id });
    const token = await generateToken({ 
        tokenId: tokenDatabase._id,
        email: user.email,
        name: user.name,
        role: user.role
    });

    //! Set the token in a cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/', 
    };
    
    const serializedCookie = serialize('jwt', token, cookieOptions);
    const response = NextResponse.json(
      { 
        success: true, 
        msg: "تم تسجيل الدخول بنجاح",  // Changed message to "Logged in successfully"
        data: { name: user.name, email: user.email, role: user.role }
      },
      { status: 200 }
    );

    // Set the JWT cookie in the response headers
    response.headers.append('Set-Cookie', serializedCookie);

    return response;

  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}