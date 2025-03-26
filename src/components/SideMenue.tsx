'use client'

import { useEffect, useRef } from "react";
import { INavList, NavList } from "./Header";
import Link from "next/link";
import { ITokenPayload } from "@/utils/token";
import CloseIcon from "./Icons/Close";

interface ISideMenueProps {
    setIsSideMenueOpen: (value: boolean) => void;
    isLoggedInUser: boolean;
    userData: ITokenPayload | null
}

const SideMenue = ({ setIsSideMenueOpen, isLoggedInUser, userData }: ISideMenueProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

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
                        className={`border-b border-gray-600 w-full py-3 px-3 text-center font-semibold text-lg`}
                        href={link}
                        onClick={closeSideMenue}
                    >
                        { name }
                    </Link>
                ))}
            </div>

            { !isLoggedInUser &&
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
            { isLoggedInUser && userData &&
                <div className="mt-auto mb-20 text-center">
                    <p className="text-lg font-semibold text-[var(--color-secondary)]">
                        أهلا, {userData?.name} 👋
                    </p>    
                </div>
            }
        </div>
    )
}

export default SideMenue;