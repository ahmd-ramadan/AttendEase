'use client'

import { ISession, ITokenPayload } from "@/interfaces";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionUpdateStatusTypes } from "./SessionsLayout";
import toast from "react-hot-toast";
import { deleteData, postData } from "@/utils/apiService";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Spinner from "../Spinner";
import { formatDate } from "@/utils/date";
import Modal from "../Modal";
import AddSessionComponent from "./AddSession";
import StudentsIcon from "../Icons/Students";
import TimeIcon from "../Icons/Time";
import BagIcon from "../Icons/Bag";
import Time2Icon from "../Icons/Time2";
import { getRandomColor } from "@/utils/colors";

interface ISessionCardProps {
    userData: ITokenPayload | null;
    session: ISession;
    sessions: ISession[];
    setSessions: (session: ISession[]) => void;
}

const SessionCard = ({ userData, session, sessions, setSessions }: ISessionCardProps) => {
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState<boolean>(false);
    const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] = useState<boolean>(false);
    const [sessionUpdateStatus, setSessionUpdateStatus] = useState<SessionUpdateStatusTypes>(null);
    const closeAddSessionModal = () => { setIsAddSessionModalOpen(false) }
    const closeDeleteSessionModal = () => { setIsDeleteSessionModalOpen(false) }

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visitorId, setVisitorId] = useState<string>("");
    const [location, setLocation] = useState(Object);
    const handleInteraction = async () => {
        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        
        // Retrieve the visitor identifier
        const { visitorId } = result;
        setVisitorId(visitorId);
        // console.log('Visitor ID:', visitorId);
    };
    const getLocation = async () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(position.coords)
                    // console.log("✅ موقع الطالب:", latitude, longitude);
                },
                (error) => {
                // console.error("❌ خطأ في جلب الموقع:", error.message);
            }
        )
        } else {
            // console.error("❌ المتصفح لا يدعم تحديد الموقع الجغرافي.");
        }
    }
    
    useEffect(() => {
        const getData = async() => {
            await handleInteraction();
            await getLocation();
        }
        getData();
    }, [])
    const onRecordInSession = async () => {
        console.log("VistorId: ", visitorId)
        console.log("Location: ", location.latitude, location.longitude);

        if (!visitorId && !location) {
            toast.error("البيانات غير مكتملة");
            return null;
        }

        try {
            setIsLoading(true);
            const { success, msg, data: newSession }: any = await postData({
                endpoint: `/session/${session._id}`,
                data: {
                    visitorId,
                    location: { 
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                }
            })
            
            if (success) {
                toast.success(msg || "تم اشتراكك في الجلسة بنجاح");
                setSessions(sessions.map((s) => s._id === session._id ? newSession : s))
            } else {
                toast.error(msg ||  "فشلت عملية التسجيل");
            }
        } finally {
            setIsLoading(false);
        }


    }

    const onDeleteSession = async () => {        
        try {
            setIsLoading(true);
            const { success, msg, data: deletedSession }: any = await deleteData({
                endpoint: `/session/${session?._id}`,
            })
            
            if (success) {
                toast.success(msg || "تم حذف السيشن بنجاح");
                setSessions(sessions.filter((s) => s._id !== session?._id))
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
        startAt,
        endAt,
        students,
        createdAt,
        courseId
    } = session

    return (
        <div 
            className={`h-full flex flex-col gap-6 md:gap-10 rounded-3xl hover:bg-gray-300 p-2 shadow-sm sm:p-6`}
            style={{ 
                // borderTop: `20px solid ${getRandomColor()}`,
                border: `15px solid ${getRandomColor()}`
            }}
        >   
            <Link 
                href={`/sessions/${_id}`} 
                className="sm:flex sm:justify-between sm:gap-4 lg:gap-6"
            >
                <div className="mt-4 sm:mt-0">
                    <h3 className="text-lg font-semibold text-pretty text-gray-900">
                        {title}
                    </h3>
                </div>
            </Link>
        
            <dl className="flex-1 h-full flex flex-col gap-4">
                
                {/* { userData && userData?.role === 'Student' &&
                    <div className="flex items-center gap-2">
                        <dt className="text-gray-700 text-lg">
                            <span className="sr-only"> Teach by </span>
                            <BagIcon size={20}/>
                        </dt>
            
                        <dd className="text-xs text-gray-700">{ doctorId.name }</dd>
                    </div> 
                } */}
        
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

                <div className="flex items-center gap-2">
                    <dt className="text-gray-700 text-lg">
                        <span className="sr-only"> Session Time </span>
                        <Time2Icon size={20} />
                    </dt>
        
                    <dd className="text-xs text-gray-700 flex flex-col gap-1">
                        <p><strong>من</strong> { formatDate({ date: startAt, withTime: true })}</p>
                        <p><strong>إلي</strong> {formatDate({ date: endAt, withTime: true })}</p>
                    </dd>
                </div>

                { userData && userData?.role === 'Student' && students.some(std => std._id.toString() === userData?.userId.toString()) && 
                    <div className="flex items-center gap-2">
                        <dt className="text-gray-700 text-lg">
                            <span className="sr-only"> Published on </span>
                            <p>&#9989;</p>
                        </dt>
            
                        <dd className="text-xs text-gray-700">مُسجل حضور</dd>
                    </div>
                }

                {/* Operations On Sessions For Student */}
                { userData && userData?.role === 'Student' && !students.some(std => std._id.toString() === userData?.userId.toString()) && 
                    <div className="mt-auto w-full">
                        <button
                            disabled={isLoading && _id === _id}
                            onClick={(e) => {
                                onRecordInSession();
                            }}
                            className="p-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                        >
                            { 
                                isLoading ? <div className="flex items-center gap-2">
                                    <span>جاٍر التسجيل...</span> <Spinner /> 
                                </div>  
                                : "تسجيل حضور"
                            }
                        </button>
                    </div> 
                }
                
                {/* Operations On Sessions For Doctor */}
                { userData && userData?.role === 'Doctor' &&
                    <div className="mt-auto w-full flex items-center gap-1">
                        <button
                            disabled={isLoading}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSessionUpdateStatus('update');
                                setIsAddSessionModalOpen(true);
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
                                setIsDeleteSessionModalOpen(true);
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
                title={sessionUpdateStatus === 'add' ? "إضافة جلسة جديد" : "تعديل الجلسة"}
                isOpen={isAddSessionModalOpen}
                closeModal={closeAddSessionModal}
            >
                <AddSessionComponent 
                    status={sessionUpdateStatus} 
                    updatedSession={session}
                    sessions={sessions} 
                    setSessions={setSessions}
                    course={courseId}
                />
            </Modal>

            <Modal
                title={"حذف الجلسة"}
                isOpen={isDeleteSessionModalOpen}
                closeModal={closeDeleteSessionModal}
            >
                <div className="w-full flex flex-col gap-4">
                    <p className="text-lg font-bold text-gray-600">
                        هذا الإجراء لايمكن التراجع فيه .. هل تريد فعلياً حذف هذا الجلسة 
                    </p>

                    <div className="text-left flex gap-4">
                        <button
                            onClick={onDeleteSession}
                            disabled={isLoading}
                            className="px-6 py-2 text-white font-semibold bg-red-600 rounded-md"
                        >
                            { isLoading ? <Spinner /> :  "حذف" }
                        </button>
                        <button
                            onClick={closeDeleteSessionModal}
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
export default SessionCard;