import dbConnect from "@/lib/dbConnection";
import { authenticate } from "@/middlewares/auth";
import Course, { ICourse } from "@/models/Course";
import { UserRolesEnum } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

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
      const isCourseExist: ICourse | null = await Course.findById(courseId);
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
      const updatedCourse = await Course.findByIdAndUpdate(isCourseExist?._id, { $set: { title }}, { new: true });
  
      // Check if creation failed
      if (!updatedCourse) {
        return NextResponse.json(
          { success: false, msg: "فشلت عملية تحديث الكورس .. حاول مرة أخري" },
          { status: 400 }
        );
      }
  
      return NextResponse.json(
        {
          success: true,
          msg: "تم تحديث الكورس بنجاح",
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


// Delete course
interface ParticipationCourseRequestBody {
  isParticipation: boolean
}

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

        // find course
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json(
                { success: false, msg: "هذا الكورس غير موجود" },
                { status: 400 }
            )
        }

        const userId: string = request?.user?._id as string;
        let participatiins: string [] = course.students;
        console.log(participatiins)
        if (!isParticipation) {
            participatiins = participatiins.filter(id => id.toString() !== userId?.toString());
        } else {
            const isStudentAlreadParticipation = participatiins.some(id => id?.toString() === userId?.toString());
            if (!isStudentAlreadParticipation) participatiins.push(userId);
        }

        course.students = participatiins;
        await course.save();

        return NextResponse.json(
            {
                success: true,
                msg: "تم إضافتك إلي الكورس بنجاح",
                data: course,
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
