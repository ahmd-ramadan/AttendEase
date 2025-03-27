'use client'
import HomeBody from "@/components/HomeBody";
import { PageStatusTypes } from "@/types";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/interfaces";
import { useEffect, useState } from "react";

const HomePage = () =>  {
    
    const [pageStatus, setPageStatus] = useState<PageStatusTypes>('idle');
    const [userData, setUserData] = useState<ITokenPayload | null>(null);
    
    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if(data) setUserData(data);
            setPageStatus('success');
        }
        getUserData();
    }, [])

    if (pageStatus !== 'success') {
        return null;
    }
    
    return (
        <div className="flex flex-col gap-4">
            <HomeBody 
                userData={userData}
            />
        </div>
    );
}

export default HomePage