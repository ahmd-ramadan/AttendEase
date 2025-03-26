'use client'

import SessionDetailsComponent from "@/components/Sessions/SessionDetails";
import Spinner from "@/components/Spinner";
import { ISession } from "@/models/Session";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/utils/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ISessionDetailsProps {
    params: {
        sessionId: string;
    }
}

const SessionDetailsPage = ({ params: { sessionId } }: ISessionDetailsProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sessionErrorMsg, setSessionErrorMsg] = useState("");
    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);
    const [session, setSession] = useState<ISession | null>(null)
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
        const getSession = async () => {
            try {
                const { success, msg, data }: any = await getData<ISession>({
                    endpoint: `/session/${sessionId}`
                });
                
                if(success) {
                    setSession(data)
                } else {
                    setSessionErrorMsg(msg || "هذه الجلسة غير موجودة الان");
                    // if(msg) toast.error(msg)
                }
            } catch(err) {
                console.log(err);
            }
        }
        if (isLoggedInUser) getSession();
    }, [isLoggedInUser])

    useEffect(() => {
        if (isLoggedInUser && (session || sessionErrorMsg.length)) setIsLoading(false);
    }, [isLoggedInUser, session, sessionErrorMsg])


    if (isLoading) {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        )
    }

    if (sessionErrorMsg) {
        return (
            <div className="flex justify-center items-center w-full h-svh">
                <p className="text-gray-500 text-lg font-bold text-center">{sessionErrorMsg} !!</p>
            </div>
        )
    }
    
    return (
        <div className="m-2">
            <SessionDetailsComponent 
                session={session} 
                setSession={setSession}
                isLoggedInUser={isLoggedInUser}
                userData={userData}
            />
        </div>
    )
}

export default SessionDetailsPage;