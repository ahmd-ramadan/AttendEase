'use client'

import SessionDetailsComponent from "@/components/Sessions/SessionDetails";
import Spinner from "@/components/Spinner";
import { ISession, ITokenPayload } from "@/interfaces";
import { PageStatusTypes } from "@/types";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SessionDetailsPage = () => {

    const params = useParams();
    const { sessionId } = params;

    const router = useRouter();

    const [pageStatus, setPageStatus] = useState<PageStatusTypes>('idle');
    const [pageErrorMsg, setPageErrorMsg] = useState<string>("");
    const [session, setSession] = useState<ISession | null>(null)
    const [userData, setUserData] = useState<ITokenPayload | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if(data) {
                setUserData(data)
            } else {
                setPageStatus('failed')
            }
        }
        getUserData();
    }, [])

    useEffect(() => {
        const getSession = async () => {
            try {
                const { success, msg, data }: any = await getData<ISession>({
                    endpoint: `/session/${sessionId}`
                });
                
                if(success) {
                    setSession(data);
                    setPageStatus(success);
                } else {
                    setPageErrorMsg(msg || "هذه الجلسة غير موجودة الان");
                    setPageStatus('failed')
                }
            } catch(err) {
                setPageStatus('failed')
                console.log(err);
            }
        }
        if (userData) getSession();
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
            <SessionDetailsComponent 
                session={session} 
                setSession={setSession}
                userData={userData}
            />
        </div>
    )
}

export default SessionDetailsPage;