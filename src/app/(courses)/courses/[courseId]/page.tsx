'use client'

import { useState, useEffect } from "react";
import CourseDetailsComponent from "@/components/Courses/CourseDetails";
import Spinner from "@/components/Spinner";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PageStatusTypes } from "@/types";
import { ICourse, ITokenPayload } from "@/interfaces";
  
const CourseDetailsPage = () => {
    const params = useParams();
    const { courseId } = params;
    
    const router = useRouter();

    const [pageStatus, setPageStatus] = useState<PageStatusTypes>('idle');
    const [pageErrorMsg, setPageErrorMsg] = useState("");
    const [course, setCourse] = useState<ICourse | null>(null);
    const [userData, setUserData] = useState<ITokenPayload | null>(null);
  
    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if (data) {
                setUserData(data);
            } else {
                setPageStatus('failed');
            }
        };
        getUserData();
    }, []);
  
    useEffect(() => {
        const getCourse = async () => {
            try {
                setPageStatus('loading');
                const { success, msg, data }: any = await getData<ICourse>({
                    endpoint: `/course/${courseId}`,
                });

                if (success) {
                    setCourse(data);
                    setPageStatus('success')
                } else {
                    setPageErrorMsg(msg || "هذا الكورس غير موجود الأن");
                    setPageStatus('failed');
                }
            } catch (err) {
                setPageStatus('failed')
                console.log(err);
            }
        };
        if (userData) getCourse();
    }, [userData]);
  
    if (pageStatus === 'idle' || pageStatus === 'loading') {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        );
    }

    if (pageStatus === 'failed') {
        if (pageErrorMsg) {
            return (
                <div className="flex justify-center items-center w-full h-svh">
                    <p className="text-gray-500 text-lg font-bold text-center">{pageErrorMsg} !!</p>
                </div>
            );
        } else {
            router.push('/login');
            toast.success('برجاء تسجيل الدخول اولاً')
            return null;
        }
    }
  
    return (
        <div className="m-2">
            <CourseDetailsComponent
                course={course}
                setCourse={setCourse}
                userData={userData}
            />
        </div>
    );
  };
  
  export default CourseDetailsPage;
  