'use client'

import SessionsLayout from "@/components/Sessions/SessionsLayout";
import Spinner from "@/components/Spinner";
import { ISession, ITokenPayload } from "@/interfaces";
import { PageStatusTypes } from "@/types";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SessionsPage = () => {

    const router = useRouter();
    const [pageStatus, setPageStatus] = useState<PageStatusTypes>('idle');
    const [pageErrorMsg, setPageErrorMsg] = useState<string>("");
    const [sessions, setSessions] = useState<ISession[]>([])
    const [userData, setUserData] = useState<ITokenPayload | null>(null);

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
                const { success, msg, data }: any = await getData<ISession[]>({
                    endpoint: `/session/?role=${userData?.role}`
                });
                
                if(success) {
                    setSessions(data)
                    setPageStatus('success');
                } else {
                    setPageErrorMsg(msg);
                    setPageStatus('failed')
                }
            } catch(err) {
                setPageStatus('failed');
                console.log(err);
            }
        }
        if (userData) getAllCourses();
    }, [userData])

    if (pageStatus === 'idle' || pageStatus === 'loading') {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        )
    }

    if (pageStatus === 'failed') {
        if (pageErrorMsg) {
            return (
                <div className="flex justify-center items-center w-full h-svh">
                    <p className="text-gray-500 text-lg font-bold text-center">{pageErrorMsg} !!</p>
                </div>
            )
        } else {
            router.push('/login');
            toast.success('برجاء تسجيل الدخول اولاً')
            return null;
        }
    }

    return (
        <div className="m-2">
            <SessionsLayout
                sessions={sessions}
                setSessions={setSessions}
                userData={userData}
            />
        </div>
    )
}

export default SessionsPage;