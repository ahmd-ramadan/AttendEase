'use client'
import HomeBody from "@/components/HomeBody";
import { getTokenCookiesData } from "@/utils/cookies";
import { ITokenPayload } from "@/utils/token";
import { useEffect, useState } from "react";

const HomePage = () =>  {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(true);
    const [userData, setUserData] = useState<ITokenPayload | null>(null);
    
    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if(data) setUserData(data);
            else setIsLoggedInUser(false);
        }
        getUserData();
    }, [])

    // useEffect(() => {
    //     if (userData) setIsLoading(true)
    // }, [userData])
    
    return (
        <div className="flex flex-col gap-4">
            <HomeBody 
                userData={userData}
                isLoggedInUser={isLoggedInUser}
            />
        </div>
    );
}

export default HomePage