'use client'

import SessionsLayout from "@/components/SessionsLayout";
import Spinner from "@/components/Spinner";
import { ISession } from "@/models/Session";
import { getData } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/utils/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SessionsPage = () => {

    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [isSessionsLoading, setSessionsLoading] = useState<boolean>(true);
    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);
    const [sessions, setSessions] = useState<ISession[]>([])
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
                const { success, msg, data }: any = await getData<ISession[]>({
                    endpoint: `/session/?role=${userData?.role}`
                });
                
                if(success) {
                    setSessions(data)
                } else {
                    if(msg) toast.error(msg)
                }
            } catch(err) {
                console.log(err);
            } finally {
                setSessionsLoading(false);
            }
        }
        if (isLoggedInUser && userData) getAllCourses();
    }, [isLoggedInUser, userData])

    useEffect(() => {
        if (isLoggedInUser && userData && !isSessionsLoading) setIsPageLoading(false);
    }, [isLoggedInUser, userData, isSessionsLoading])



    if (isPageLoading) {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <Spinner className="mx-auto" size="30px" />
            </div>
        )
    }

    return (
        <div className="m-2">
            <SessionsLayout
                sessions={sessions}
                setSessions={setSessions}
                isLoggedInUser={isLoggedInUser}
                userData={userData}
            />
        </div>
    )
}

export default SessionsPage;