'use client'

import Link from "next/link"
import { useEffect, useState } from "react";
import SideMenue from "./SideMenue";
import { getTokenCookiesData } from "@/utils/cookies";
import { IUser } from "@/models/User";
import { ITokenPayload } from "@/utils/token";

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

    return (
        <div className="bg-white/75" dir="rtl">
            <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <Link className="block text-[var(--color-secondary)]" href="/">
                    <span className="sr-only">Home</span>
                    <svg fill="currentColor" height="50px" width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M255.946,83.759c-33.069,0-59.972,26.903-59.972,59.971c0,33.069,26.903,59.972,59.972,59.972 c33.068,0,59.971-26.903,59.971-59.972C315.917,110.662,289.014,83.759,255.946,83.759z M255.946,183.304 c-21.821,0-39.574-17.753-39.574-39.574c0-21.821,17.753-39.573,39.574-39.573c21.821,0,39.573,17.753,39.573,39.573 C295.519,165.551,277.767,183.304,255.946,183.304z"></path> </g> </g> <g> <g> <path d="M112.363,144.796c-27.175,0-49.283,22.108-49.283,49.283c0,27.175,22.108,49.283,49.283,49.283 c27.175,0,49.283-22.108,49.283-49.283S139.537,144.796,112.363,144.796z M112.363,222.963c-15.927,0-28.884-12.957-28.884-28.884 c0-15.927,12.957-28.884,28.884-28.884c15.927,0,28.884,12.958,28.884,28.884C141.247,210.005,128.29,222.963,112.363,222.963z"></path> </g> </g> <g> <g> <path d="M399.674,144.796c-27.174,0-49.283,22.108-49.283,49.283c0,27.175,22.109,49.283,49.283,49.283 c27.175,0,49.282-22.108,49.282-49.283S426.848,144.796,399.674,144.796z M399.674,222.963c-15.927,0-28.884-12.957-28.884-28.884 c0-15.927,12.957-28.884,28.884-28.884c15.926,0,28.883,12.958,28.883,28.884C428.557,210.005,415.6,222.963,399.674,222.963z"></path> </g> </g> <g> <g> <path d="M501.801,407.843h-28.677V332.75c0-40.5-32.95-73.45-73.451-73.45c-22.522,0-42.698,10.198-56.181,26.209 c-10.521-38.473-45.781-66.836-87.546-66.836c-41.729,0-76.956,28.381-87.451,66.874c-13.464-16.033-33.626-26.247-56.132-26.247 c-40.5,0-73.451,32.95-73.451,73.45v75.093H10.199C4.566,407.843,0,412.409,0,418.042c0,5.633,4.566,10.199,10.199,10.199h491.602 c5.632,0,10.199-4.566,10.199-10.199C512,412.409,507.433,407.843,501.801,407.843z M165.306,407.843H59.31V332.75 c0-29.252,23.799-53.051,53.052-53.051c29.193,0,52.943,23.799,52.943,53.051V407.843z M326.225,407.843H185.704v-98.421 c0-38.792,31.51-70.351,70.242-70.351c38.792,0,70.351,31.559,70.351,70.351L326.225,407.843z M452.725,407.842h-106.03v-77.865 c1.447-27.969,24.657-50.279,52.979-50.279c29.252,0,53.051,23.799,53.051,53.051V407.842z"></path> </g> </g> <g> <g> <path d="M207.08,329.54c-5.633,0-10.199,4.566-10.199,10.199v48.939c0,5.633,4.566,10.199,10.199,10.199 s10.199-4.566,10.199-10.199V339.74C217.279,334.108,212.713,329.54,207.08,329.54z"></path> </g> </g> <g> <g> <path d="M207.08,296.915c-5.633,0-10.199,4.566-10.199,10.199v2.175c0,5.633,4.566,10.199,10.199,10.199 s10.199-4.566,10.199-10.199v-2.175C217.279,301.481,212.713,296.915,207.08,296.915z"></path> </g> </g> </g></svg>
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
                            <div className="">
                                <p className="text-lg font-semibold text-[var(--color-secondary)]">
                                    أهلا, {userData?.name} 👋
                                </p>    
                            </div>
                        }

                        <button
                            onClick={() => setIsSideMenueOpen(true)}
                            className="block rounded-sm bg-gray-200 p-2.5 text-gray-600/80 transition hover:text-gray-600 md:hidden"
                        >
                            <span className="sr-only">Toggle menu</span>
                            
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>    
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