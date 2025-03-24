import { NextResponse } from 'next/server';
import User, { IUser, UserRolesEnum } from '@/models/User';
import dbConnect from '@/lib/dbConnection';
import { generatePassword, generateSalt } from '@/utils/auth';
import Token from '@/models/Token';
import { generateToken } from '@/utils/token';
import { serialize } from 'cookie';

interface UserRequestBody {
  name: string;
  email: string;
  password: string;
  role: UserRolesEnum;
}

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    // Parse the request body and cast it to the UserRequestBody type
    const { name, email, password, role }: UserRequestBody = await request.json();

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { 
          success: false, 
          msg: 'برجاء أدخل جميع البيانات المطلوبة'
        },
        { status: 400 }
      );
    }

    //! Check if user exists in the database
    const isUserExist: IUser | null = await User.findOne({ email: email });
    if (isUserExist) {
      return NextResponse.json(
        { 
          success: false, 
          msg: 'هذا المستخدم موجود بالفعل'
        },
        { status: 404 }
      );
    }

    //! Hashed password
    const salt = await generateSalt();
    const hashedPassword = await generatePassword(password, salt);

    //! Create new user (student/doctor) in the database
    const newUser: IUser | null = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Check if creation failed
    if (!newUser) {
      return NextResponse.json(
        { success: false, msg: 'فشلت عملية أنشاء الحساب .. حاول مرة أخري' },
        { status: 404 }
      );
    }

    //! Generate Token
    const tokenDatabase = await Token.create({ userId: newUser._id });
    const token = await generateToken({ 
      tokenId: tokenDatabase.id,
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
    
    //! Set the token in a cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/', 
    };
        
    const serializedCookie = serialize('jwt', token, cookieOptions);
    const response = NextResponse.json(
      { 
        success: true, 
        msg: "تم تسجيل الدخول بنجاح",  // Changed message to "Logged in successfully"
        data: { name: newUser.name, email: newUser.email, role: newUser.role }
      },
      { status: 200 }
    );
    
        // Set the JWT cookie in the response headers
        response.headers.append('Set-Cookie', serializedCookie);

    // Return the newUser data
    return NextResponse.json(
      { 
        success: true, 
        msg: "تم إنشاء الحساب بنجاح",
        data: newUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
