'use client'

import { ICourse } from "@/models/Course";
import { formatDate } from "@/utils/date";
import { ITokenPayload } from "@/utils/token";
import Link from "next/link";
import Modal from "./Modal";
import AddCourseComponent from "./AddCourse";
import { useState } from "react";
import Spinner from "./Spinner";
import { deleteData, postData } from "@/utils/apiService";
import toast from "react-hot-toast";

interface ICoursesLayoutProps {
    courses: ICourse[];
    setCourses: (course: ICourse[]) => void;
    isLoggedInUser: boolean;
    userData: ITokenPayload | null
}
export type CourseUpdateStatusTypes = 'update' | 'add' | null;

const CoursesLayout = ({ courses, setCourses, isLoggedInUser, userData }: ICoursesLayoutProps) => {

    const [selectedCourse, setSelectedCourse] = useState<ICourse>({} as ICourse);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState<boolean>(false);
    const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState<boolean>(false);
    const [courseUpdateStatus, setCourseUpdateStatus] = useState<CourseUpdateStatusTypes>(null);
    const closeAddCourseModal = () => { setIsAddCourseModalOpen(false) }
    const closeDeleteCourseModal = () => { setIsDeleteCourseModalOpen(false) }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const onParticipationInCourse = async (courseId :string) => {     
        try {
            setIsLoading(true);
            const { success, msg, data: updatedCourse }: any = await postData({
                endpoint: `/course/${courseId}`,
                data: {
                    isParticipation: true
                }
            })

            // const updatedCourse: ICourse = data;
            if (success) {
                toast.success(msg || "تم الإشتراك الكورس بنجاح");
                setCourses(courses.map((c) => c._id.toString() === updatedCourse?._id.toString() ? updatedCourse : c))
            } else {
                toast.error(msg ||  "فشلت عملية إشتراكك في كورس جديد");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onDeleteCourse = async () => {        
        try {
            setIsLoading(true);
            const { success, msg, data: deletedCourse }: any = await deleteData({
                endpoint: `/course/${selectedCourse._id}`,
            })
            
            if (success) {
                toast.success(msg || "تم حذف الكورس بنجاح");
                setCourses(courses.filter((c) => c._id.toString() !== deletedCourse?._id.toString()))
            } else {
                toast.error(msg ||  "فشلت عملية الحذف");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-3 p-2">
            {/* For Doctor Add Course Btn */}
            { isLoggedInUser && userData && userData.role === 'Doctor' &&
                <div
                    className="w-full"
                    dir="ltr"
                >
                    <button
                        disabled={isLoading}
                        onClick={() => {
                            setIsAddCourseModalOpen(true)
                            setCourseUpdateStatus('add')
                        }}
                        className="bg-[var(--color-primary)] px-6 py-2 rounded-md border-2 border-[var(--color-primary)] text-white hover:text-[var(--color-primary)] hover:bg-transparent"
                    >
                        إضافة كورس جديد
                    </button>
                </div>
            }

            <div className="w-full" dir="rtl">
                <h1 className="text-xl font-bold text-[var(--color-secondary)]">كل الكورسات</h1>
            </div>

            {/* For Show All courses */}
            { courses && courses.length ?
                <div 
                    className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
                >
                    { courses.map(({ _id, title, students, createdAt, doctorId }, idx) => (
                        <div 
                            key={idx}
                            className="h-full flex flex-col gap-6 rounded-md border border-gray-300 hover:border-[var(--color-secondary)] p-2 shadow-sm sm:p-6"
                        >
                            <Link 
                                href={`/courses/${_id}`} 
                                className="sm:flex sm:justify-between sm:gap-4 lg:gap-6"
                            >
                                <div className="mt-4 sm:mt-0">
                                    <h3 className="text-lg font-semibold text-pretty text-gray-900">
                                        {title}
                                    </h3>
                                </div>
                            </Link>
                    
                            <dl className="flex-1 h-full flex flex-col gap-4">
                                
                                { userData && userData?.role === 'Student' &&
                                    <div className="flex items-center gap-2">
                                        <dt className="text-gray-700 text-lg">
                                            <span className="sr-only"> Teach by </span>
                                            <svg className="size-6" fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 442 442">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier"> 
                                                    <path d="M418.609,94.182H290.283V55.057c0-5.523-4.478-10-10-10H161.717c-5.523,0-10,4.477-10,10v39.126H23.391 C10.493,94.182,0,104.675,0,117.573v74.391v181.589c0,12.897,10.493,23.39,23.391,23.39h395.219 c12.897,0,23.391-10.493,23.391-23.39V191.964v-74.391C442,104.675,431.507,94.182,418.609,94.182z M171.717,65.057h98.566v29.126 h-98.566V65.057z M20,117.573c0-1.87,1.521-3.391,3.391-3.391h395.219c1.869,0,3.391,1.521,3.391,3.391v74.391 c0,17.783-14.468,32.251-32.251,32.251H252.785v-33.234c0-5.523-4.478-10-10-10h-43.57c-5.523,0-10,4.477-10,10v33.234H52.251 C34.468,224.215,20,209.747,20,191.964V117.573z M209.215,244.215h23.57v11.449c0,6.499-5.287,11.785-11.785,11.785 c-6.499,0-11.785-5.287-11.785-11.785V244.215z M209.215,224.215v-23.234h23.57v23.234H209.215z M418.609,376.943H23.391 c-1.87,0-3.391-1.521-3.391-3.39V233.028c8.89,6.997,20.087,11.187,32.251,11.187h136.963v11.449 c0,17.526,14.259,31.785,31.785,31.785s31.785-14.259,31.785-31.785v-11.449h136.964c12.164,0,23.362-4.19,32.251-11.187v140.525 C422,375.422,420.479,376.943,418.609,376.943z"></path> 
                                                </g>
                                            </svg>
                                        </dt>
                            
                                        <dd className="text-xs text-gray-700">{ doctorId.name }</dd>
                                    </div> 
                                }
                        
                                <div className="flex items-center gap-2">
                                    <dt className="text-gray-700">
                                        <span className="sr-only"> Students Number </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-6 fill-current">
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
                                        <span className="sr-only"> Published at </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            className="size-6"
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

                                { userData && userData?.role === 'Student' && students.some(std => std.email === userData?.email) && 
                                    <div className="flex items-center gap-2">
                                        <dt className="text-gray-700 text-lg">
                                            <span className="sr-only"> Published on </span>
                                            <p>&#9989;</p>
                                        </dt>
                            
                                        <dd className="text-xs text-gray-700">مُسجل في الكورس</dd>
                                    </div>
                                }

                                { userData && userData?.role === 'Student' && !students.some(std => std.email === userData?.email) && 
                                    <div className="mt-auto w-full">
                                        <button
                                            disabled={isLoading && selectedCourse._id === _id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCourse(courses[idx])
                                                onParticipationInCourse(_id);
                                            }}
                                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                                        >
                                            { 
                                                isLoading && selectedCourse._id === _id ? <div className="flex items-center gap-2">
                                                    <span>جاٍر الإشتراك...</span> <Spinner /> 
                                                </div> 
                                                : "إشتراك"
                                            }
                                        </button>
                                    </div> 
                                }

                                { userData && userData?.role === 'Doctor' &&
                                    <div className="mt-auto w-full flex items-center gap-1">
                                        <button
                                            disabled={isLoading && selectedCourse._id === _id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCourse(courses[idx]);
                                                setCourseUpdateStatus('update');
                                                setIsAddCourseModalOpen(true);
                                            }}
                                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                                        >
                                            { 
                                                isLoading && selectedCourse._id === _id ? <div className="flex items-center gap-2">
                                                    <span>جاٍر التعديل...</span> <Spinner /> 
                                                </div> 
                                                : "تعديل"
                                            }
                                        </button>
                                        <button
                                            disabled={isLoading && selectedCourse._id === _id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCourse(courses[idx]);
                                                setIsDeleteCourseModalOpen(true);
                                            }}
                                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-red-600 border border-red-600 hover:bg-transparent"
                                        >
                                            { 
                                                isLoading && selectedCourse._id === _id? <div className="flex items-center gap-2">
                                                    <span>جاٍر الحذف...</span> <Spinner /> 
                                                </div> 
                                                : "حذف"
                                            }
                                        </button>
                                    </div> 
                                }
                            </dl>
                        </div>
                    ))}
                </div>
                :  <div className="flex justify-center w-full mt-20">
                    <p className="text-gray-500 text-lg font-bold text-center">لا يوجد أي كورسات في الوقت الحالي !</p>
                </div>
            }

            <Modal
                title={courseUpdateStatus === 'add' ? "إضافة كورس جديد" : "تعديل الكورس"}
                isOpen={isAddCourseModalOpen}
                closeModal={closeAddCourseModal}
            >
                <AddCourseComponent
                    status={courseUpdateStatus} 
                    updatedCourse={selectedCourse}
                    courses={courses} 
                    setCourses={setCourses}
                />
            </Modal>
            <Modal
                title={"حذف الكورس"}
                isOpen={isDeleteCourseModalOpen}
                closeModal={closeDeleteCourseModal}
            >
                <div className="w-full flex flex-col gap-4">
                    <p className="text-lg font-bold text-gray-600">
                        هذا الإجراء لايمكن التراجع فيه .. هل تريد فعلياً حذف هذا الكورس 
                    </p>

                    <div className="text-left flex gap-4">
                        <button
                            onClick={onDeleteCourse}
                            disabled={isLoading}
                            className="px-6 py-2 text-white font-semibold bg-red-600 rounded-md"
                        >
                            { isLoading ? <Spinner /> :  "حذف" }
                        </button>
                        <button
                            onClick={closeDeleteCourseModal}
                            disabled={isLoading}
                            className="px-6 py-2 text-white font-semibold bg-[var(--color-primary)] rounded-md"
                        >
                            { isLoading ? <Spinner /> : "إلغاء" }
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CoursesLayout;