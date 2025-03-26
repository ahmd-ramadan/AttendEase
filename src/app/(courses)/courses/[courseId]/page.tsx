'use client' 

import CourseDetailsComponent from "@/components/Courses/CourseDetails";
import Spinner from "@/components/Spinner";
import { ICourse } from "@/models/Course";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/utils/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ICourseDetailsProps {
    params: {
        courseId: string;
    }
}

const CourseDetailsPage = ({ params: { courseId } }: ICourseDetailsProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [courseErrorMsg, setCourseErrorMsg] = useState("");
    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);
    const [course, setCourse] = useState<ICourse | null>(null)
    const [userData, setUserData] = useState<ITokenPayload | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if(data) {
                setUserData(data)
                setIsLoggedInUser(true);
            }
        }
        getUserData();
    }, [])

    useEffect(() => {
        const getCourse = async () => {
            try {
                const { success, msg, data }: any = await getData<ICourse>({
                    endpoint: `/course/${courseId}`
                });
                
                if(success) {
                    setCourse(data)
                } else {
                    setCourseErrorMsg(msg || "هذا الكورس غير موجود الأن")
                    // if(msg) toast.error(msg)
                }
            } catch(err) {
                console.log(err);
            }
        }
        if (isLoggedInUser) getCourse();
    }, [isLoggedInUser])

    useEffect(() => {
        if (isLoggedInUser && (course || courseErrorMsg.length)) setIsLoading(false);
    }, [isLoggedInUser, course, courseErrorMsg])


    if (isLoading) {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        )
    }

    if (courseErrorMsg) {
        return (
            <div className="flex justify-center items-center w-full h-svh">
                <p className="text-gray-500 text-lg font-bold text-center">{courseErrorMsg} !!</p>
            </div>
        )
    }
    
    return (
        <div className="m-2">
            <CourseDetailsComponent 
                course={course} 
                setCourse={setCourse}
                isLoggedInUser={isLoggedInUser}
                userData={userData}
            />
        </div>
    )
}

export default CourseDetailsPage;