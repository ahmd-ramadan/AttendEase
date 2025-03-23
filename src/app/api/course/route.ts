import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import Course, { ICourse } from "@/models/Course";
import { authenticate } from "@/middlewares/auth";
import { UserRolesEnum } from "@/models/User";

// Create new course
export async function POST(request: NextRequest) {
  // First, authenticate the user before proceeding
  const authResponse = await authenticate({
    request, 
    allowedRoles: [UserRolesEnum.doctor] 
  });
  if (authResponse !== true) {
    // If authentication failed, return early
    return authResponse;
  }

  await dbConnect();

  try {
    const { title }: { title: string } = await request.json();

    // Validation
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          msg: "عنوان الكورس فارغ",
        },
        { status: 400 }
      );
    }

    // Check if course exists in the database
    const isCourseExist: ICourse | null = await Course.findOne({ title });
    if (isCourseExist) {
      return NextResponse.json(
        {
          success: false,
          msg: "هذا الكورس موجود بالفعل",
        },
        { status: 400 }
      );
    }

    // Create new course in the database
    let newCourse: ICourse | null = await Course.create({
      title,
      doctorId: request?.user?._id
    });

    // Check if creation failed
    if (!newCourse) {
      return NextResponse.json(
        { success: false, msg: "فشلت عملية إنشاء كورس جديد .. حاول مرة أخري" },
        { status: 400 }
      );
    }

    let createdCourse: ICourse | null = await Course.findById(newCourse._id).populate([
      {
        path: "students",
        model: "User",
        select: "name email"
      },
      {
        path: "doctorId",
        model: "User",
        select: "name email"
      }
    ]);;    

    return NextResponse.json(
      {
        success: true,
        msg: "تم إنشاء الكورس بنجاح",
        data: createdCourse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all courses
export async function GET(request: NextRequest) {
  // First, authenticate the user before proceeding
  const authResponse = await authenticate({
    request, 
    allowedRoles: [UserRolesEnum.doctor, UserRolesEnum.student] 
  });
  if (authResponse !== true) {
    // If authentication failed, return early
    return authResponse;
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (role !== request?.user?.role) {
      return NextResponse.json(
        { success: false, msg: 'غير مسموح لك برؤية هذا'},
        { status: 401 }
      )
    }

    //For students
    const userId = request?.user?._id;
    let query: any = {}

    // For doctors
    if (role === UserRolesEnum.doctor) { 
      query = { doctorId: userId }
    }
    
    // get all coursers that participation in
    const courses = await Course.find(query)
      .populate([
        { 
          path: 'students', 
          model: 'User',
          select: 'name email' 
        }, {
          path: 'doctorId', 
          model: 'User',
          select: 'name email'
        }
      ])

    // Check if creation failed
    if (courses.length <= 0) {
      return NextResponse.json(
        { 
          success: true, 
          msg: role === UserRolesEnum.student ? 'أنت غير مشترك في أي كورسات' : 'ليس لديك أي كورسات الأن', 
          data: []
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        msg: "",
        data: courses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retreving courses:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

