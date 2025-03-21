import { NextResponse } from 'next/server';
import User, { IUser, UserRolesEnum } from '@/models/User';
import dbConnect from '@/lib/dbConnection';
import { generatePassword, generateSalt } from '@/utils/auth';

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

    // Return the User data
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
