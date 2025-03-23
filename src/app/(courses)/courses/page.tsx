'use client'

import CoursesLayout from "@/components/CoursesLayout";
import { ICourse } from "@/models/Course";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/utils/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CoursesPage = () => {

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
            }
        }
        if (isLoggedInUser) getAllCourses();
    }, [isLoggedInUser])

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