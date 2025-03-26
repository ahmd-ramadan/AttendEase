'use client'

import Link from "next/link"
import { useEffect, useState } from "react";
import SideMenue from "./SideMenue";
import { getTokenCookiesData } from "@/utils/cookies";
import { IUser } from "@/models/User";
import { ITokenPayload } from "@/utils/token";
import LogoIcon from "./Icons/Logo";
import ToggleMenueIcon from "./Icons/ToggleMenue";
import { postData } from "@/utils/apiService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

export interface INavList {
    name: string;
    link: string;
}

export const NavList: INavList[] = [
    { name: 'الرئيسية', link: '' },
    { name: 'كورساتي', link: 'courses' },
    { name: 'جلسات الحضور', link: 'sessions' }
]

const Header = () => {  
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [activePage, setActivePage] = useState<string>("");
    const [isSideMenueOpen, setIsSideMenueOpen] = useState<boolean>(false);
    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(true);
    const [userData, setUserData] = useState<ITokenPayload | null>(null);

    //! For first time page load
    useEffect(() => {
        const pageUrl = window.location.href.split('/');
        const activePage = NavList.filter(({ link }) => pageUrl.includes(link) && link !== "")[0]?.link || "";    
        setActivePage(activePage);
    }, [])

    useEffect(() => {
        const getUserData = async () => {
            const data: ITokenPayload | null = await getTokenCookiesData();
            if(data) setUserData(data);
            else setIsLoggedInUser(false);
        }
        getUserData();
    }, [])

    const onLogout = async () => {
        try {
            const { success, msg, data }: any = await postData({
                endpoint: '/auth/logout'
            });

            toast.success("تم تسجيل الخروج بنجاح");
            router.push('/');
        } finally {
            setIsLoading(true);
        }
    }

    return (
        <div className="bg-white/75" dir="rtl">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <Link className="block text-[var(--color-secondary)]" href="/">
                    <span className="sr-only">Home</span>
                    <LogoIcon size={50} />
                    </Link>

                <div className="flex flex-1 items-center justify-end md:justify-between">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-sm">
                            { NavList.map(({ name, link}, idx ) => (
                                <li key={idx}>
                                    <Link 
                                        onClick={() => setActivePage(link)}
                                        key={idx}
                                        className={`${ activePage === link ? 'text-[var(--color-secondary)]' : 'text-black' } font-semibold transition rounded-md p-2 hover:text-[var(--color-secondary)] hover:border hover:border-[var(--color-secondary)]`}
                                        href={`/${link}`}
                                    > 
                                        {name} 
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        { !isLoggedInUser && 
                            <div className="sm:flex sm:gap-4">
                                <Link
                                    className="block rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-secondary)]"
                                    href="/login"
                                >
                                    تسجيل الدخول
                                </Link>

                                <Link
                                    className="hidden rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition hover:font-semibold hover:text-[var(--color-secondary)]/75 sm:block"
                                    href="/signup"
                                >
                                    إنشاء حساب
                                </Link>
                            </div>
                        }
                        { isLoggedInUser && userData &&
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold text-[var(--color-secondary)]">
                                    أهلا, {userData?.name} 👋
                                </p>    
                                <button
                                    disabled={isLoading}
                                    className="hidden rounded-md bg-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white border border-[var(--color-secondary)] transition hover:font-semibold hover:text-[var(--color-secondary)] sm:block hover:bg-transparent"
                                    onClick={onLogout}
                                >
                                    { isLoading ? <Spinner /> :' تسجيل الخروج' }
                                </button>
                            </div>
                        }

                        <button
                            onClick={() => setIsSideMenueOpen(true)}
                            className="block rounded-sm bg-gray-200 p-2.5 text-gray-600/80 transition hover:text-gray-600 md:hidden"
                        >
                            <span className="sr-only">Toggle menu</span>
                            
                            <ToggleMenueIcon size={20}/>    
                        </button>
                    </div>
                </div>
            </div>
            
            { isSideMenueOpen ? 
                <SideMenue 
                    setIsSideMenueOpen={setIsSideMenueOpen} 
                    isLoggedInUser={isLoggedInUser} 
                    userData={userData}
                /> 
                : null 
            }
        </div>
        
    )
}

export default Header;