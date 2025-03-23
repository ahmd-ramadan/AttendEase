'use client'

import { ICourse } from "@/models/Course";
import { ApiResponse, getData, ResponseTypes } from "@/utils/apiService";
import { getTokenCookiesData } from "@/utils/cookies";
import { formatDate } from "@/utils/date";
import { ITokenPayload } from "@/utils/token";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ICourseDetailsComponentProps {
    courseId: string;
}

const CourseDetailsComponent = ({ courseId }: ICourseDetailsComponentProps) => {

    const [isLoggedInUser, setIsLoggedInUser] = useState<boolean>(false);
    const [course, setCourse] = useState<ICourse>({} as ICourse)
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
        const getCourseDetails = async () => {
            try {
                const { success, msg, data }: any = await getData<ICourse[]>({
                    endpoint: `/course/${courseId}/?role=${userData?.role}`
                });
                
                if(success) {
                    setCourse(data)
                } else {
                    if(msg) toast.error(msg)
                }
            } catch(err) {
                console.log(err);
            }
        }
        if (isLoggedInUser) getCourseDetails();
    }, [isLoggedInUser])

    return (
        <div className="flex flex-col gap-3 p-2">
            {/* For Doctor Add Course Btn */}
            { isLoggedInUser && userData && userData.role === 'Doctor' }
                <div
                    className="w-full"
                    dir="ltr"
                >
                    <button
                        className="bg-[var(--color-primary)] px-6 py-2 rounded-md border-2 border-[var(--color-primary)] text-white hover:text-[var(--color-primary)] hover:bg-transparent"
                    >
                        إضافة جلسة حضور جديدة
                    </button>
                </div>

            {/* For Show All courses */}
            <div 
                className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
                { course && course?.sessions && course?.sessions.map(({ _id, title, students, createdAt, doctorId }, idx) => (
                    <Link 
                        href={`/courses/${_id}`} 
                        className="block rounded-md border border-gray-300 hover:border-[var(--color-secondary)] p-4 shadow-sm sm:p-6"
                    >
                        <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                            {/* <div className="sm:order-last sm:shrink-0">
                                <img
                                alt=""
                                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                                className="size-16 rounded-full object-cover sm:size-[72px]"
                                />
                            </div> */}
                  
                            <div className="mt-4 sm:mt-0">
                                <h3 className="text-lg font-semibold text-pretty text-gray-900">
                                    {/* How I built my first website with Nuxt, Tailwind CSS and Vercel */}
                                    {title}
                                </h3>
                  
                                {/* <p className="mt-1 text-sm text-gray-700">دكتور: {doctorId.name}</p> */}
                  
                                {/* <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit illum provident a, ipsa
                                    maiores deleniti consectetur nobis et eaque.
                                </p> */}
                            </div>
                        </div>
                  
                        <dl className="mt-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <dt className="text-gray-700 text-lg">
                                    <span className="sr-only"> Teach by </span>
                                    <svg className="size-5" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 442 442">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier"> 
                                            <path d="M418.609,94.182H290.283V55.057c0-5.523-4.478-10-10-10H161.717c-5.523,0-10,4.477-10,10v39.126H23.391 C10.493,94.182,0,104.675,0,117.573v74.391v181.589c0,12.897,10.493,23.39,23.391,23.39h395.219 c12.897,0,23.391-10.493,23.391-23.39V191.964v-74.391C442,104.675,431.507,94.182,418.609,94.182z M171.717,65.057h98.566v29.126 h-98.566V65.057z M20,117.573c0-1.87,1.521-3.391,3.391-3.391h395.219c1.869,0,3.391,1.521,3.391,3.391v74.391 c0,17.783-14.468,32.251-32.251,32.251H252.785v-33.234c0-5.523-4.478-10-10-10h-43.57c-5.523,0-10,4.477-10,10v33.234H52.251 C34.468,224.215,20,209.747,20,191.964V117.573z M209.215,244.215h23.57v11.449c0,6.499-5.287,11.785-11.785,11.785 c-6.499,0-11.785-5.287-11.785-11.785V244.215z M209.215,224.215v-23.234h23.57v23.234H209.215z M418.609,376.943H23.391 c-1.87,0-3.391-1.521-3.391-3.39V233.028c8.89,6.997,20.087,11.187,32.251,11.187h136.963v11.449 c0,17.526,14.259,31.785,31.785,31.785s31.785-14.259,31.785-31.785v-11.449h136.964c12.164,0,23.362-4.19,32.251-11.187v140.525 C422,375.422,420.479,376.943,418.609,376.943z"></path> 
                                        </g>
                                    </svg>
                                </dt>
                    
                                <dd className="text-xs text-gray-700">{ doctorId.name }</dd>
                            </div>
                    
                            <div className="flex items-center gap-2">
                                <dt className="text-gray-700">
                                    <span className="sr-only"> Students Number </span>
                    
                                    {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className="size-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                                        />
                                    </svg> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                                        <g>
                                            <circle style={{ fill: "currentColor" }} cx="256" cy="220.68" r="69.104"></circle> 
                                            <path style={{ fill: "currentColor" }} d="M365.408,423.912c-1.2-66.016-49.68-119.136-109.408-119.136s-108.224,53.136-109.408,119.136 H365.408z"></path>
                                            <circle style={{ fill: "currentColor" }} cx="82.192" cy="140.008" r="51.92"></circle> 
                                            <path style={{ fill: "currentColor" }} d="M164.4,292.696c-0.896-49.584-37.312-89.504-82.208-89.504S0.896,243.112,0,292.696H164.4z"></path> 
                                            <circle style={{ fill: "currentColor" }} cx="429.792" cy="140.008" r="51.92"></circle>
                                            <path style={{ fill: "currentColor" }} d="M512,292.696c-0.896-49.584-37.312-89.504-82.208-89.504s-81.296,39.92-82.208,89.504H512z"></path> 
                                        </g> 
                                    </svg>

                                </dt>
                    
                                <dd className="text-xs text-gray-700">{students.length} طالب</dd>
                            </div>

                            <div className="flex items-center gap-2">
                                <dt className="text-gray-700 text-lg">
                                    <span className="sr-only"> Published on </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className="size-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                        />
                                    </svg>
                                </dt>
                    
                                <dd className="text-xs text-gray-700">{ formatDate({ date: createdAt })}</dd>
                            </div>
                        </dl>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CourseDetailsComponent;