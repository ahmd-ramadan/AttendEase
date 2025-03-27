'use client'

import { useEffect, useRef, useState } from "react";
import { NavList } from "./Header";
import Link from "next/link";
import { ITokenPayload } from "@/interfaces";
import CloseIcon from "./Icons/Close";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/apiService";

interface ISideMenueProps {
    setIsSideMenueOpen: (value: boolean) => void;
    userData: ITokenPayload | null;
    setUserData: (userData: ITokenPayload | null) => void;
}

const SideMenue = ({ setIsSideMenueOpen, userData, setUserData }: ISideMenueProps) => {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeSideMenue();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const closeSideMenue = () => {
        setIsSideMenueOpen(false);
    }

    const onLogout = async () => {
        try {
            setIsLoading(true)
            const { success, msg, data }: any = await postData({ 
                endpoint: "/auth/logout",
                data: {
                    userId: userData?.userId
                }
            });

            toast.success("تم تسجيل الخروج بنجاح");
            setUserData(null);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    }

    //! For first time page load
    const [activePage, setActivePage] = useState<string>("");
    useEffect(() => {
        const pageUrl = window.location.href.split('/');
        const activePage = NavList.filter(({ link }) => pageUrl.includes(link) && link !== "")[0]?.link || "";    
        setActivePage(activePage);
    }, [])

    return (
        <div 
            ref={menuRef}
            className={`absolute p-3 left-0 top-0 gap-6 flex flex-col bg-white h-screen overflow-y-auto scrollbar md:w-1/3 w-[90%] rounded-r-xl shadow-lg z-30 transition-all duration-1000 ease-in-out transform`}
        >
            <div className="flex justify-between items-center text-gray-600">
                <span className="sr-only">Close menu</span>
                    <CloseIcon size={30} onClick={closeSideMenue}/>
               </div>
            <div className="w-full flex flex-col items-center gap-3">
                { NavList.map(({ name, link }, idx) => (
                    <Link
                        key={idx}
                        className={`${activePage === link ? 'text-[var(--color-secondary)]' : 'text-balck' } border-b border-gray-600 hover:text-[var(--color-secondary)] w-full py-3 px-3 text-center font-semibold text-lg`}
                        href={userData && link !== "" ? `/${link}` : '/login'}
                        onClick={closeSideMenue}
                    >
                        { name }
                    </Link>
                ))}
            </div>

            { !userData &&
                <div className="mt-auto  w-full flex flex-col items-center gap-3 mb-8">
                    <Link
                        href={"/login"}
                        onClick={closeSideMenue}
                        className="w-1/2 text-center font-semibold px-6 py-2 rounded-md bg-[var(--color-primary)] hover:bg-transparent border-2 border-[var(--color-primary)] text-white hover:text-[var(--color-primary)]"
                    >
                        تسجيل الدخول
                    </Link>
                    <Link
                        href={"/signup"}
                        onClick={closeSideMenue}
                        className="w-1/2 text-center font-semibold px-6 py-2 rounded-md bg-[var(--color-secondary)] hover:bg-transparent border-2 border-[var(--color-secondary)] text-white hover:text-[var(--color-secondary)]"
                    >
                        إنشاء حساب
                    </Link>
                </div>
            }
            {  userData &&
                <div className="mt-auto mb-20 flex flex-col gap-2 text-center">
                    <p className="text-lg font-semibold text-[var(--color-secondary)]">
                        أهلا, {userData?.name} 👋
                    </p>
                    <button
                        disabled={isLoading}
                        className="rounded-md w-1/2 mx-auto flex justify-center bg-[var(--color-secondary)] p-2 text-sm font-semibold text-white border border-[var(--color-secondary)] transition hover:font-semibold hover:text-[var(--color-secondary)] hover:bg-transparent"
                        onClick={onLogout}
                    >
                        { isLoading ? <Spinner /> :' تسجيل الخروج' }
                    </button>    
                </div>
            }
        </div>
    )
}

export default SideMenue;