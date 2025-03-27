'use client'

import { ICourse, ISession, ITokenPayload } from "@/interfaces";
import { getData, postData, putData } from "@/utils/apiService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import { UpdatedComTypes } from "@/types";

interface IAddSessionComponentProps {
    isSingleSession?: boolean;
    isSessionsPage?: boolean;
    status: UpdatedComTypes;
    updatedSession?: ISession | null;
    setUpdatedSession?(session: ISession): void;
    sessions?: ISession[];
    setSessions?: (sessions: ISession[]) => void;
    course?: ICourse,
    userData?: ITokenPayload;
}

interface IUpdateNewSession {
    startAt?: string,
    endAt?: string,
    title?: string
}

interface IReqUpdateNewSession {
    startAt?: Date,
    endAt?: Date,
    title?: string;
    courseId: string;
}

const AddSessionComponent = ({ 
    isSingleSession = false, 
    isSessionsPage = false,
    status, 
    sessions, 
    setSessions, 
    setUpdatedSession, 
    updatedSession,
    course,
    userData
}: IAddSessionComponentProps) => {
  
    const [newUpdatedSession, setNewUpdatedSession] = useState<IUpdateNewSession>(status === 'update' ? updatedSession || {} as IUpdateNewSession : {} as IUpdateNewSession);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>(course?._id || "")

    useEffect(() => { 
        const getCourses = async () => {
            try {
                const { success, msg, data }: any = await getData({
                    endpoint: '/course?role=Doctor'
                })

                if (success) setCourses(data)
                
            } catch {}
        }
        if (isSessionsPage) getCourses();
    }, [isSessionsPage])
    const onAddSession = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCourseId) {
            toast.error("يجب عليك إختيار الكورس الذي تريد إضافة الجلسة له");
            return null;
        }

        if (newUpdatedSession?.title && newUpdatedSession?.title.length <= 4) {
            toast.error("ادخل عنوان معبر علي الأقل 5 أحرف");
            return null;
        }

        const newStartAt: string = newUpdatedSession?.startAt || updatedSession?.startAt || "";
        const newEndAt: string = newUpdatedSession?.endAt || updatedSession?.endAt || "";
        if (new Date(newStartAt) >= new Date(newEndAt)) {
            toast.error("يجب أن يكون تاريخ الإنتهاء أبعد من تاريخ الإبتداء");
            return null;
        }
        
        try {
            setIsLoading(true);

            let formData: IReqUpdateNewSession = {
                courseId: selectedCourseId
            }
            if(newUpdatedSession.title) formData.title = newUpdatedSession.title;
            if(newUpdatedSession.endAt) formData.startAt = new Date(newUpdatedSession.startAt as string);
            if(newUpdatedSession.startAt) formData.endAt = new Date(newUpdatedSession.endAt as string);
            
            const { success, msg, data: newSession }: any = status === 'add' ? await postData({
                endpoint: '/session',
                data: formData
            }) : await putData({
                endpoint: `/session/${updatedSession?._id}`,
                data: formData
            })
            console.log(newSession);
            if (success) {
                toast.success(msg || "تم إضافة الجلسة بنجاح");
                if (isSingleSession) {
                    if (status === 'update' && setUpdatedSession) setUpdatedSession(newSession);
                }
                else {
                    if (status === 'add' && sessions && setSessions) setSessions([ ...sessions, newSession ]);
                    if (status === 'update' && sessions && setSessions) setSessions(sessions.map(s => s._id.toString() === newSession._id.toString() ? newSession : s));
                }
            } else {
                toast.error(msg ||  "فشلت عملية إضافة جلسة جديد");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <form  className="flex flex-col gap-4" onSubmit={onAddSession}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">عنوان الجلسة</label>
                    <input 
                        id="title" type="text" 
                        value={newUpdatedSession.title} 
                        onChange={(e) => setNewUpdatedSession({ ... newUpdatedSession, title: e.target.value })}
                        className="border focus:outline-[var(--color-primary)] border-gray-500 rounded-md p-2"
                        required={status === "add"}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">التاريخ الإبتدائي</label>
                    <input 
                        id="title" type="datetime-local" 
                        value={newUpdatedSession.startAt} 
                        onChange={(e) => setNewUpdatedSession({ ... newUpdatedSession, startAt: e.target.value })}
                        className="border focus:outline-[var(--color-primary)] border-gray-500 rounded-md p-2"
                        required={status === "add"}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">التاريخ النهائي</label>
                    <input 
                        id="title" type="datetime-local" 
                        value={newUpdatedSession.endAt} 
                        onChange={(e) => setNewUpdatedSession({ ... newUpdatedSession, endAt: e.target.value })}
                        className="border focus:outline-[var(--color-primary)] border-gray-500 rounded-md p-2"
                        required={status === "add"}
                    />
                </div>

                {/* Select Course to add courseId to session */}
                {isSessionsPage && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="courseId">إختيار الكورس</label>
                        <select
                            id="courseId"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="border focus:outline-[var(--color-primary)] border-gray-500 rounded-md p-2"
                            required={status === "add"}
                        >
                            <option value="" disabled>اختر الكورس</option>
                            {/* Select from all courses added by him */}
                            {courses.filter((c) => c.doctorId?._id.toString() === userData?.userId.toString() ).map((course) => (
                                <option key={course._id} value={course?._id || ""}>
                                    {course?.title || "غير مسمي"}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                  className="p-2 rounded-md flex justify-center mx-auto w-1/2 text-white hover:text-[var(--color-primary)] text-lg font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                >
                    { 
                        isLoading ?  
                            <div className="flex items-center gap-2">
                                <span>{ status === 'add' ? 'جاٍر اللإضافة...' : 'جاٍر التعديل'}</span> <Spinner /> 
                            </div> : status === 'add' ? "إضافة" : "تعديل" 
                    }
                </button>
            </form>
        </div>
    ) 
}

export default AddSessionComponent;