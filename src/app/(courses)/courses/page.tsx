'use client'

import CoursesLayout from "@/components/CoursesLayout";
import Spinner from "@/components/Spinner";
import { ICourse } from "@/models/Course";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/utils/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CoursesPage = () => {

    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [isCoursesLoading, setCoursesLoading] = useState<boolean>(true);
    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);
    const [courses, setCourses] = useState<ICourse[]>([])
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
        const getAllCourses = async () => {
            try {
                const { success, msg, data }: any = await getData<ICourse[]>({
                    endpoint: `/course/?role=${userData?.role}`
                });
                
                if(success) {
                    setCourses(data)
                } else {
                    if(msg) toast.error(msg)
                }
            } catch(err) {
                console.log(err);
            } finally {
                setCoursesLoading(false);
            }
        }
        if (isLoggedInUser && userData) getAllCourses();
    }, [isLoggedInUser, userData])

    useEffect(() => {
        if (isLoggedInUser && userData && !isCoursesLoading) setIsPageLoading(false);
    }, [isLoggedInUser, userData, isCoursesLoading])

    if (isPageLoading) {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        )
    }


    return (
        <div className="m-2">
            <CoursesLayout 
                courses={courses}
                setCourses={setCourses}
                isLoggedInUser={isLoggedInUser}
                userData={userData}
            />
        </div>
    )
}

export default CoursesPage;