'use client'

import { isHideHeader } from "@/utils/header";
import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";

interface IMainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {

    const pathname = usePathname();
    const [isHidedHeaderPage, setIsHidedHeaderPage] = useState<boolean>(true);
    
    useEffect(() => {
        const isHidedHeaderPage = isHideHeader(pathname);
        setIsHidedHeaderPage(isHidedHeaderPage);
    }, [pathname])

    return (
        <div className="">
            { !isHidedHeaderPage && 
            <header
                className="fixed top-0 w-full bg-transparent"
            >
                <Header />
            </header>
            }
            <main className={`${!isHidedHeaderPage ? 'mt-16' : ''} bg-gray-100`}>
                { children }
            </main>
        </div>
    );
}

export default MainLayout;
