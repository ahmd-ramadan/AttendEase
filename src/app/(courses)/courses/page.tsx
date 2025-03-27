'use client'

import CoursesLayout from "@/components/Courses/CoursesLayout";
import Spinner from "@/components/Spinner";
import { ICourse, ITokenPayload } from "@/interfaces";
import { PageStatusTypes } from "@/types";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CoursesPage = () => {
    const router = useRouter();

    const [pageStatus, setPageStatus] = useState<PageStatusTypes>('idle');
    const [userData, setUserData] = useState<ITokenPayload | null>(null);
    const [courses, setCourses] = useState<ICourse[]>([])

    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if(data) {
                setUserData(data)
            } else {
                setPageStatus('failed');
            }
        }
        getUserData();
    }, [])

    useEffect(() => {
        const getAllCourses = async () => {
            try {
                setPageStatus('loading')
                const { success, msg, data }: any = await getData<ICourse[]>({
                    endpoint: `/course/?role=${userData?.role}`
                });
                
                if(success) {
                    setCourses(data)
                    setPageStatus('success');
                } else {
                    if(msg) toast.error(msg)
                    setPageStatus('failed')
                }
            } catch(err) {
                setPageStatus('failed')
                console.log(err);
            }
        }
        if (userData) getAllCourses();
    }, [userData]);

    if (pageStatus === 'idle' || pageStatus == 'loading') {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        )
    }

    if (pageStatus === 'failed') {
        router.push('/login');
        toast.success('برجاء تسجيل الدخول اولاً')
        return null;
    }

    return (
        <div className="m-2">
            <CoursesLayout 
                courses={courses}
                setCourses={setCourses}
                userData={userData}
            />
        </div>
    )
}

export default CoursesPage;