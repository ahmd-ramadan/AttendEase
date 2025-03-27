'use client'

import { ICourse,  ITokenPayload } from "@/interfaces";
import Link from "next/link";
import Spinner from "../Spinner";
import toast from "react-hot-toast";
import { deleteData, postData } from "@/utils/apiService";
import { useState } from "react";
import { formatDate } from "@/utils/date";
import Modal from "../Modal";
import AddCourseComponent from "./AddCourse";
import BagIcon from "../Icons/Bag";
import StudentsIcon from "../Icons/Students";
import TimeIcon from "../Icons/Time";
import { getRandomColor } from "@/utils/colors";
import { UpdatedComTypes } from "@/types";

interface ICourseCardProps {
    userData: ITokenPayload | null;
    course: ICourse;
    courses: ICourse[];
    setCourses: (courses: ICourse[]) => void
}

const CourseCard = ({ 
    userData, 
    course, 
    courses, 
    setCourses 
}: ICourseCardProps) => {

    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState<boolean>(false);
    const [isDeleteCourseModalOpen, setIsDeleteCourseModalOpen] = useState<boolean>(false);
    const [courseUpdateStatus, setCourseUpdateStatus] = useState<UpdatedComTypes>(null);
    const closeAddCourseModal = () => { setIsAddCourseModalOpen(false) }
    const closeDeleteCourseModal = () => { setIsDeleteCourseModalOpen(false) }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const onParticipationInCourse = async () => {     
        try {
            setIsLoading(true);
            const { success, msg, data: updatedCourse }: any = await postData({
                endpoint: `/course/${course._id}`,
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
                endpoint: `/course/${course._id}`,
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


    const {
        _id,
        title,
        doctorId,
        students,
        sessions,
        createdAt, 
    } = course;

    return (
        <div 
            className="h-full flex flex-col gap-6 md:gap-10 rounded-3xl p-2 shadow-sm sm:p-6 hover:bg-gray-100"
            style={{ 
                // borderTop: `20px solid ${getRandomColor()}`,
                border: `15px solid ${getRandomColor()}`
            }}
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
                            <BagIcon size={20} />
                        </dt>
            
                        <dd className="text-xs text-gray-700">{ doctorId.name }</dd>
                    </div> 
                }
        
                <div className="flex items-center gap-2">
                    <dt className="text-gray-700">
                        <span className="sr-only"> Students Number </span>
                        <StudentsIcon size={20} />

                    </dt>
        
                    <dd className="text-xs text-gray-700">{students.length} طالب</dd>
                </div>

                <div className="flex items-center gap-2">
                    <dt className="text-gray-700 text-lg">
                        <span className="sr-only"> Published at </span>
                       <TimeIcon size={20} />
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
                            disabled={isLoading }
                            onClick={(e) => {
                                e.stopPropagation();
                                onParticipationInCourse();
                            }}
                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                        >
                            { 
                                isLoading  ? <div className="flex items-center gap-2">
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
                            disabled={isLoading}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCourseUpdateStatus('update');
                                setIsAddCourseModalOpen(true);
                            }}
                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                        >
                            { 
                                isLoading ? <div className="flex items-center gap-2">
                                    <span>جاٍر التعديل...</span> <Spinner /> 
                                </div> 
                                : "تعديل"
                            }
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteCourseModalOpen(true);
                            }}
                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-red-600 border border-red-600 hover:bg-transparent"
                        >
                            { 
                                isLoading ? <div className="flex items-center gap-2">
                                    <span>جاٍر الحذف...</span> <Spinner /> 
                                </div> 
                                : "حذف"
                            }
                        </button>
                    </div> 
                }
            </dl>

            <Modal
                title={courseUpdateStatus === 'add' ? "إضافة كورس جديد" : "تعديل الكورس"}
                isOpen={isAddCourseModalOpen}
                closeModal={closeAddCourseModal}
            >
                <AddCourseComponent
                    status={courseUpdateStatus} 
                    updatedCourse={course}
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
export default CourseCard;