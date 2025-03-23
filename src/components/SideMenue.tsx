'use client'

import { useEffect, useRef } from "react";
import { NavList } from "./Header";
import Link from "next/link";

interface ISideMenueProps {
    setIsSideMenueOpen: (value: boolean) => void
}

const SideMenue = ({ setIsSideMenueOpen }: ISideMenueProps) => {
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
                <svg onClick={closeSideMenue} width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></g></svg>
            </div>
            <div className="w-full flex flex-col items-center gap-3">
                { NavList.map(({ name, link }, idx) => (
                    <Link
                        className={`border-b border-gray-600 w-full py-3 px-3 text-center font-semibold text-lg`}
                        href={link}
                    >
                        { name }
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideMenue;