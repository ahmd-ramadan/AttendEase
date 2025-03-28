import dbConnect from "@/lib/dbConnection";
import { authenticate } from "@/middlewares/auth";
import Course from "@/models/Course";
import Session from "@/models/Session";
import { UserRolesEnum } from "@/enums";
import { ISession } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

interface ParticipationCourseRequestBody {
  isParticipation: boolean
}

// Update course
export async function PUT(request: NextRequest) {
    // First, authenticate the user before proceeding
    const authResponse = await authenticate({
        request, allowedRoles: [UserRolesEnum.doctor]
    });
    if (authResponse !== true) {
      // If authentication failed, return early
      return authResponse;
    }
  
    await dbConnect();
  
    try {
        const courseId = request.url.split('/').pop() || '';
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
      const isCourseExist = await Course.findById(courseId).populate([
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
      ]);

      if (!isCourseExist) {
        return NextResponse.json(
          {
            success: false,
            msg: "هذا الكورس غير موجود",
          },
          { status: 404 }
        );
      }
  
      // Update course
      isCourseExist.title = title;
      await isCourseExist.save();
      // const updatedCourse = await Course.findByIdAndUpdate(isCourseExist?._id, { $set: { title }}, { new: true });
      
      // Check if creation failed
      // if (!updatedCourse) {
      //   return NextResponse.json(
      //     { success: false, msg: "فشلت عملية تحديث الكورس .. حاول مرة أخري" },
      //     { status: 400 }
      //   );
      // }
  
      return NextResponse.json(
        {
          success: true,
          msg: "تم تحديث الكورس بنجاح",
          data: isCourseExist,
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

// Delete course
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
        const courseId = request.url.split('/').pop() || '';
    
        // Delete course
        const deletedCourse = await Course.findByIdAndDelete(courseId);
    
        // Check if creation failed
        if (!deletedCourse) {
            return NextResponse.json(
            { success: false, msg: "فشلت عملية حذف الكورس .. حاول مرة أخري" },
            { status: 400 }
            );
        }
  
        return NextResponse.json(
            {
            success: true,
            msg: "تم حذف الكورس بنجاح",
            data: deletedCourse,
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

// Student participate in course
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
        const courseId = request.url.split('/').pop() || '';
        const { isParticipation }: ParticipationCourseRequestBody = await request.json();

        console.log("Course: ", courseId, isParticipation)

        // find course
        const course = await Course.findById(courseId).populate({
          path: "students",
          model: "User",
          select: "name email"
        });
        if (!course) {
            return NextResponse.json(
                { success: false, msg: "هذا الكورس غير موجود" },
                { status: 400 }
            )
        }

        const userId: string = request?.user?._id as string;
        let participations: string [] = course.students;
        console.log(participations)
        if (!isParticipation) {
            participations = participations.filter(id => id.toString() !== userId?.toString());
        } else {
            const isStudentAlreadParticipation = participations.some(id => id?.toString() === userId?.toString());
            if (!isStudentAlreadParticipation) participations.push(userId);
        }

        course.students = participations;
        await course.save();

        const updatedCourse = await Course.findById(courseId).populate([
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
        ]);

        return NextResponse.json(
            {
                success: true,
                msg: "تم إضافتك إلي الكورس بنجاح",
                data: updatedCourse,
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

// Get course details
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResponse = await authenticate({
    request,
    allowedRoles: [UserRolesEnum.student, UserRolesEnum.doctor],
  });

  if (authResponse !== true) {
    return authResponse;
  }

  await dbConnect();

  try {
    // Extract course ID from URL
    const courseId = request.url.split("/").pop() || "";

    // Fetch course and convert to plain object
    let courseDoc = await Course.findById(courseId).populate([
      { path: "students", model: "User", select: "name email" },
      { path: "doctorId", model: "User", select: "name email" },
    ]);

    if (!courseDoc) {
      return NextResponse.json(
        { success: false, msg: "هذا الكورس غير موجود" },
        { status: 400 }
      );
    }

    // Convert Mongoose document to plain object
    let course = courseDoc.toObject();

    // Fetch and populate course sessions
    const allCourseSessions: ISession[] = await Session.find({ courseId })
      .populate([
        { path: "students", model: "User", select: "name email" },
        { path: "doctorId", model: "User", select: "name email" },
        { path: "courseId", model: "Course", select: "title students" },
      ])
      .exec();

    // Merge course data with sessions
    course.sessions = allCourseSessions;

    return NextResponse.json(
      {
        success: true,
        msg: "",
        data: course,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

