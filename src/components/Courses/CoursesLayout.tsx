import { ICourse, ITokenPayload } from "@/interfaces";
import CourseCard from "./CourseCard";
import AddCourseBtn from "./AddCourseBtn";

interface ICoursesLayoutProps {
    courses: ICourse[];
    setCourses: (course: ICourse[]) => void;
    userData: ITokenPayload | null
}

const CoursesLayout = ({ courses, setCourses, userData }: ICoursesLayoutProps) => {

    return (
        <div className="mt-8 flex flex-col gap-3 p-2">
            {/* For Doctor Add Course Btn */}
            <AddCourseBtn 
                userData={userData}
                courses={courses}
                setCourses={setCourses}
            />

            <div className="w-full" dir="rtl">
                <h1 className="text-xl font-bold text-[var(--color-secondary)]">كل الكورسات</h1>
            </div>

            {/* For Show All courses */}
            { courses && courses.length ?
                <div 
                    className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6"
                >
                    { courses.map((course, idx) => (
                        <CourseCard 
                            key={idx}
                            userData={userData}
                            courses={courses}
                            setCourses={setCourses}
                            course={course}
                        />
                    ))}
                </div>
                :  <div className="flex justify-center w-full mt-20">
                    <p className="text-gray-500 text-lg font-bold text-center">لا يوجد أي كورسات في الوقت الحالي !</p>
                </div>
            }
        </div>
    )
}

export default CoursesLayout;