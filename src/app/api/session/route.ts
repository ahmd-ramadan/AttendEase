import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import { authenticate } from "@/middlewares/auth";
import { UserRolesEnum } from "@/models/User";
import Session, { ISession } from "@/models/Session";
import Course from "@/models/Course";

interface IPostRequestBody {
    title: string;
    startAt: Date;
    endAt: Date;
    courseId: string;
}

// Create new session
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
    const { title, startAt, endAt, courseId }: IPostRequestBody  = await request.json();

    // Validation
    if (!title || !startAt || !endAt || !courseId) {
      return NextResponse.json(
        {
          success: false,
          msg: "من فضلك أدخل جميع البيانات المطلوية",
        },
        { status: 400 }
      );
    }
    
    if (startAt >= endAt) {
      return NextResponse.json(
        {
          success: false,
          msg: "تاريخ انتهاء فترة التسجيل يجب أن يكون أكبر من الابتدائي",
        },
        { status: 400 }
      );
    }

    // Create new session in the database
    const newSession: ISession | null = await Session.create({
      title,
      startAt,
      endAt,
      courseId,
      doctorId: request?.user?._id
    });

    // Check if creation failed
    if (!newSession) {
      return NextResponse.json(
        { success: false, msg: "فشلت عملية إنشاء جلسة الغياب جديد .. حاول مرة أخري" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        msg: "تم إنشاء جلسة الغياب بنجاح",
        data: newSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all sessions
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

    const userId = request?.user?._id;
    let sessions: ISession [] = [];

    // For students -> all sessions for courses user participate in its
    if (role === UserRolesEnum.student) {
      // Find all courses where the student is enrolled
      const courses = await Course.find({ students: userId }).select("_id");
    
      // Extract course IDs
      const courseIds = courses.map(course => course._id);
    
      // Get all sessions for those courses
      sessions = await Session.find({ courseId: { $in: courseIds } })
        .populate([
          { 
            path: 'students', 
            model: 'User',
            select: 'name email' 
          }, {
            path: 'doctorId', 
            model: 'User',
            select: 'name email'
          },
          {
            path: 'courseId',
            model: 'Course',
            select: 'title students'
          }
        ]);
    }

    // For doctors -> all sessions created by doctor
    if (role === UserRolesEnum.doctor) { 
      sessions = await Session.find({ doctorId: userId })
      .populate([
        { 
          path: 'students', 
          model: 'User',
          select: 'name email' 
        }, {
          path: 'doctorId', 
          model: 'User',
          select: 'name email'
        },
        {
          path: 'courseId',
          model: 'Course',
          select: 'title students'
        }
      ]);
    }

    // Check if creation failed
    if (sessions.length <= 0) {
      return NextResponse.json(
        { 
          success: true, 
          msg: role === UserRolesEnum.student ? 'ليس لديك اي سجل حضور' : 'لم تقم بانشاء أي جلسات حضور حتي الان', 
          data: []
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        msg: "",
        data: sessions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retreving sessions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

