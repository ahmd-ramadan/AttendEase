'use client'

import { ICourse, ISession, ITokenPayload } from "@/interfaces";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import Spinner from "../Spinner";
import { deleteData, postData } from "@/utils/apiService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import SessionCard from "../Sessions/SessionCard";
import AddCourseComponent from "./AddCourse";
import AddSessionBtn from "../Sessions/AddSessionBtn";
import StudentsTable from "../StudentsTable";
import BagIcon from "../Icons/Bag";
import StudentsIcon from "../Icons/Students";
import TimeIcon from "../Icons/Time";
import { UpdatedComTypes } from "@/types";

interface ICourseDetailsLayoutProps {
    course: ICourse | null;
    setCourse: (course: ICourse) => void;
    userData: ITokenPayload | null
}

const CoursesDetailsComponent = ({ course, setCourse, userData }: ICourseDetailsLayoutProps) => {
    const router = useRouter()

    const [selectedCourse, setSelectedCourse] = useState<ICourse>(course as ICourse)
    const [currentSessions, setCurrentSessions] = useState<ISession[]>(course?.sessions || [])
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
                endpoint: `/course/${courseId}`,
                data: {
                    isParticipation: true
                }
            })

            // const updatedCourse: ICourse = data;
            if (success) {
                toast.success(msg || "تم الإشتراك الكورس بنجاح");
                setCourse(updatedCourse);
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
                endpoint: `/course/${course?._id}`,
            })
            
            if (success) {
                toast.success(msg || "تم حذف الكورس بنجاح");
                router.refresh()
            } else {
                toast.error(msg ||  "فشلت عملية الحذف");
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (!course || !course._id) {
        return (
            <div className="w-full h-svh flex justify-center items-center">
                <p className="text-gray-600 text-3xl text-center font-bold">هذا الكورس غير موجود أو ربما حدث خطأ !</p>
            </div>
        )
    }

    const {
        _id: courseId,
        createdAt,
       doctorId,
       students,
       title
    } = selectedCourse;
    return (
        <div className="mt-20 flex flex-col gap-10 p-2">
            {/* Course Deatils */}
            <div
                className="px-6 py-2 w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-[var(--color-secondary)] rounded-md" 
            >
                {/* General data */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold text-[var(--color-secondary)]">{ title }</h1>
                    <dl className="flex-1 h-full flex flex-col gap-2">
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
                    </dl>
                </div> 

                {/* Operations */}
                <div className="flex flex-row items-center sm:flex-col gap-3">
                { userData && userData?.role === 'Student' && !students.some(std => std.email === userData?.email) && 
                            <div className="mt-auto w-full">
                                <button
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onParticipationInCourse();
                                    }}
                                    className="px-6 py-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                                >
                                    { 
                                        isLoading ? <div className="flex items-center gap-2">
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
                </div>
            </div>

            {/* Course Students Table */}
            <StudentsTable 
                students={students}
                userData={userData}
            />

            {/* For Show All sessions courses */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 justify-between">
                    <h3 className="text-xl font-bold text-[var(--color-secondary)]">كل الجلسات</h3>
                    <AddSessionBtn
                        userData={userData}
                        course={course}
                    />
                </div>

                { currentSessions && currentSessions.length ? 
                    <div 
                        className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6"
                    >
                        { currentSessions.map((session, idx) => (
                            <SessionCard 
                                userData={userData}
                                session={session}
                                sessions={currentSessions}
                                setSessions={setCurrentSessions}
                            />
                        ))}
                    </div>
                    : <div className="flex justify-center w-full mt-20">
                        <p className="text-gray-500 text-lg font-bold text-center">لا يوجد أي جلسات في الوقت الحالي !</p>
                    </div>
                }
            </div>
           
            {/* Update Course Modal */}
            <Modal
                title={courseUpdateStatus === 'add' ? "إضافة كورس جديد" : "تعديل الكورس"}
                isOpen={isAddCourseModalOpen}
                closeModal={closeAddCourseModal}
            >
                <AddCourseComponent 
                    status={courseUpdateStatus} 
                    updatedCourse={selectedCourse}
                    setUpdatedCourse={setSelectedCourse}
                    isSingleCourse={true}
                />
            </Modal>

            {/* Delete Course Modal */}
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

export default CoursesDetailsComponent;