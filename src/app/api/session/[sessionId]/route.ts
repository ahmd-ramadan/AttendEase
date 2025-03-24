import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import { authenticate } from "@/middlewares/auth";
import { UserRolesEnum } from "@/models/User";
import Session, { ISession } from "@/models/Session";
import { getDistance } from "@/utils/location";
import Fingerprint, { IFingerprint } from "@/models/Fingerprint";

interface IPostRequestBody {
   location: {
      latitude: Number; 
      longitude: Number;
    };  
    visitorId: string;
}

interface IPutRequestBody {
    title?: string;
    startAt?: Date;
    endAt?: Date;
}

// Student record attendance
export async function POST(request: NextRequest) {
  // First, authenticate the user before proceeding
  const authResponse = await authenticate({
    request, 
    allowedRoles: [UserRolesEnum.student] 
  });
  if (authResponse !== true) {
    // If authentication failed, return early
    return authResponse;
  }

  await dbConnect();

  try {

    //! Get sessionId params
    const sessionId: string = request.url.split('/').pop() || '';

    //! Get body 
    const { location: { latitude, longitude }, visitorId }: IPostRequestBody = await request.json();
    console.log(latitude, longitude, visitorId)
    //! Validation 
    if (!latitude || !longitude || !visitorId) {
      return NextResponse.json(
        {
          success: false,
          msg: "البيانات غير مكتملة"
        }, { status: 400 }
      )
    }

    const studentId: string = request?.user?._id as string;
   
    // Check if session exist
    const session: ISession | null = await Session.findById(sessionId).populate([
      {
        path: "students",
        model: "User",
        select: "name email"
      },
      {
        path: "doctorId",
        model: "User",
        select: "name email"
      },
      {
        path: "courseId",
        model: "Course",
        select: "title students"
      }
    ]);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          msg: "جلسة الحضور غير موجودة الان",
        },
        { status: 404 }
      );
    }
    
    //! Check is location is true

    // Hall location - change to be dynamiclly
    const classroomLat = 30.0444; // خط العرض لموقع القاعة
    const classroomLon = 31.2357; // خط الطول لموقع القاعة

    const myHomeLat = 28.4365117;
    const myHomeLon = 30.7310211;

    const distance = getDistance(+latitude, +longitude, myHomeLat, myHomeLon);
    console.log("Distance: ", distance);

    //! For accept at maximum 50 metr
    if (distance >= 50) {
        return NextResponse.json(
            {
                success: false,
                msg: "لا يمكنك التسجيل .. انت خارج النطاق"
            }, { status: 400 }
        )
    }
    
    //! Check if any one have printfragment
    const isFingerprintExist: IFingerprint | null= await Fingerprint.findOne({ visitorId });
    if (isFingerprintExist && isFingerprintExist?.userId.toString() !== studentId.toString())  {
      return NextResponse.json(
        { 
          success: false,
          msg: "لا يمكنك تسجيل الحضور .. أنت تخالف التعليمات!"
        }, { status: 401 }
      )
    }
    

    if (!isFingerprintExist) {
      const newFingerprint: IFingerprint = await Fingerprint.create({
        userId: studentId,
        visitorId
      });
    }

    //! Check if session not start
    const isSessionNotStart: boolean = new Date(session.startAt) >= new Date();
    if (isSessionNotStart) {
      return NextResponse.json(
        { 
          success: false,
          msg: "لايمكنك التسجيل الأن .. فترة التسجبل لم تبدأ بعد"
        }, { status: 400 }
      )
    }

    //! Check if session end
    const isSessionEnd: boolean = new Date(session.endAt) <= new Date();
    if (isSessionEnd) {
      return NextResponse.json(
          { 
            success: false,
            msg: "لايمكنك التسجيل الأن .. تم إنتهاء فترة التسجبل"
        }, { status: 400 }
      )
    }
    
    //! Now Student Can record attednd successfully 
    let newSession: ISession = session;
    if (!session.students.some(std => std._id.toString() === studentId.toString())) {
      newSession = await Session.findByIdAndUpdate(session._id, { $push: { students: studentId } }, { new: true }).populate([
        {
          path: "students",
          model: "User",
          select: "name email"
        },
        {
          path: "doctorId",
          model: "User",
          select: "name email"
        },
        {
          path: "courseId",
          model: "Course",
          select: "title students"
        }
      ]);
    } else {
      return NextResponse.json(
        {
          success: true,
          msg: "أنت مُسجل في هذه الجلسة بالفعل",
          data: newSession,
        },
        { status: 200 }
      );
    }

    // Check if creation failed
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, msg: "فشلت عملية إنشاء جلسة الغياب جديد .. حاول مرة أخري" },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json(
      {
        success: true,
        msg: "تم تسجيل الحضور في جلسة الغياب بنجاح",
        data: newSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recoreding attend in session:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update session
export async function PUT(request: NextRequest) {
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

    //! Get sessionId params
    const sessionId: string = request.url.split('/').pop() || '';

    //! Get body 
    const { title, startAt, endAt }: IPutRequestBody = await request.json();

    const doctorId: string = request?.user?._id as string;
   
    // Check if session exist
    const session: ISession | null = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          msg: "جلسة الحضور غير موجودة الان",
        },
        { status: 404 }
      );
    }
    
    //! Validation
    // Dates compare
    const newStartAt: Date = startAt || new Date(session?.startAt);
    const newEndAt: Date = endAt || new Date(session?.endAt);
    if (newStartAt >= newEndAt) {
        return NextResponse.json(
            {
              success: false,
              msg: "تاريخ انتهاء فترة التسجيل يجب أن يكون أكبر من الابتدائي",
            },
            { status: 400 }
          );
    }
    
    //! Update Data
    session.endAt = newEndAt.toString();
    session.startAt = newStartAt.toString();
    if (title) session.title = title; 
    await session.save();

    return NextResponse.json(
      {
        success: true,
        msg: "تم تحديث جلسة الغياب بنجاح",
        data: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recoreding attend in session:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete session
export async function DELETE(request: NextRequest) {
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
  
      //! Get sessionId params
      const sessionId: string = request.url.split('/').pop() || '';
     
      //! Delete Session
      const deleteSession = await Session.findByIdAndDelete(sessionId);
      if (!deleteSession) {
        return NextResponse.json(
            { 
                success: false,
                msg: "فشلت عملية حذف جلسة التسجيل"
            }, { status: 400 }
        )
      } 
  
      return NextResponse.json(
        {
          success: true,
          msg: "تم حذف الجلسة بنجاح",
          data: deleteSession,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error recoreding attend in session:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }
}

