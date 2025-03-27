'use client'

import { ILocation, ISession, ITokenPayload } from "@/interfaces";
import { deleteData, postData } from "@/utils/apiService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { formatDate } from "@/utils/date";
import Spinner from "../Spinner";
import Modal from "../Modal";
import AddSessionComponent from "./AddSession";
import StudentsTable from "../StudentsTable";
import BagIcon from "../Icons/Bag";
import StudentsIcon from "../Icons/Students";
import TimeIcon from "../Icons/Time";
import Time2Icon from "../Icons/Time2";

interface ISessionDetailsLayoutProps {
    session: ISession | null;
    setSession: (session: ISession) => void;
    userData: ITokenPayload | null
}

const SessionDetailsComponent = ({ session, setSession, userData }: ISessionDetailsLayoutProps) => {
    const router = useRouter()
    
    const [selectedSession, setSelectedSession] = useState<ISession>(session as ISession)
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState<boolean>(false);
    const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] = useState<boolean>(false);
    const closeAddSessionModal = () => { setIsAddSessionModalOpen(false) }
    const closeDeleteSessionModal = () => { setIsDeleteSessionModalOpen(false) }
    const [isSuccessRecordModalOpen, setIsSuccessRecordModalOpen] = useState<boolean>(false)
    const closeSuccessRecordModal = () => { setIsSuccessRecordModalOpen(false) }
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const onDeleteSession = async () => {        
        try {
            setIsLoading(true);
            const { success, msg, data: deletedSession }: any = await deleteData({
                endpoint: `/session/${selectedSession?._id}`,
            })
            
            if (success) {
                toast.success(msg || "تم حذف السيشن بنجاح");
                router.refresh()
            } else {
                toast.error(msg ||  "فشلت عملية الحذف");
            }
        } finally {
            setIsLoading(false);
        }
    }

    const [visitorId, setVisitorId] = useState<string>("");
    const [location, setLocation] = useState<ILocation | null>(null);

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
                    setLocation({ latitude, longitude })
                    // console.log("✅ موقع الطالب:", latitude, longitude);
                },
                (error) => {
                // console.error("❌ خطأ في جلب الموقع:", error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
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
        // console.log("VistorId: ", visitorId)
        // console.log("Location: ", location?.latitude, location?.longitude);

        if (!visitorId && !location) {
            toast.error("البيانات غير مكتملة");
            return null;
        }

        try {
            setIsLoading(true);
            const { success, msg, data: newSession }: any = await postData({
                endpoint: `/session/${selectedSession?._id}`,
                data: {
                    visitorId,
                    location: { 
                        latitude: location?.latitude,
                        longitude: location?.longitude
                    }
                }
            })
            
            if (success) {
                // toast.success(msg || "تم اشتراكك في الجلسة بنجاح");
                setIsSuccessRecordModalOpen(true);
                setSelectedSession(newSession)
            } else {
                toast.error(msg ||  "فشلت عملية التسجيل");
            }
        } finally {
            setIsLoading(false);
        }


    }

    if (!session || !session._id) {
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
       title,
       startAt,
       endAt
    } = selectedSession;

    return (
        <div className="mt-20 flex flex-col gap-10 p-2">
            {/* Session Deatils */}
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
                
                            <dd className="text-xs text-gray-700">{students.length} طالب حاضر</dd>
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
                                <span className="sr-only"> Published at </span>
                                <Time2Icon size={20} />
                            </dt>
                
                            <dd className="text-xs text-gray-700 flex flex-col gap-1">
                                <p><strong>من</strong> { formatDate({ date: startAt, withTime: true })}</p>
                                <p><strong>إلي</strong> {formatDate({ date: endAt, withTime: true })}</p>
                            </dd>
                        </div>

                        { userData && userData?.role === 'Student' && students.some(std => std.email === userData?.email) && 
                            <div className="flex items-center gap-2">
                                <dt className="text-gray-700 text-lg">
                                    <span className="sr-only"> Published on </span>
                                    <p>&#9989;</p>
                                </dt>
                    
                                <dd className="text-xs text-gray-700">مُسجل حضور هذه السيشن</dd>
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
                                        onRecordInSession();
                                    }}
                                    className="px-6 py-2 rounded-md flex justify-center mx-auto w-full text-white hover:text-[var(--color-primary)] text-sm font-semibold bg-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-transparent"
                                >
                                    { 
                                        isLoading ? <div className="flex items-center gap-2">
                                            <span>جاٍر التسجيل...</span> <Spinner /> 
                                        </div> 
                                        :"تسجيل حضور"
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
                </div>
            </div>

            {/* Sessions Students Table */}
            <StudentsTable 
                students={students}
                userData={userData}
            />

            {/* Update Session Modal  */}
            <Modal
                title={"تعديل الجلسة"}
                isOpen={isAddSessionModalOpen}
                closeModal={closeAddSessionModal}
            >
                <AddSessionComponent 
                    status={'update'} 
                    updatedSession={selectedSession}
                    setUpdatedSession={setSelectedSession}
                    course={selectedSession.courseId}
                    isSingleSession={true}
                />
            </Modal>

            {/* Delete Session Modal  */}
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
            <Modal
                isOpen={isSuccessRecordModalOpen}
                closeModal={closeSuccessRecordModal}
            >
                <div className="h-40 flex flex-col gap-6 justify-center items-center">
                    <p className="text-5xl">🎉✅</p>
                    <p className="text-3xl font-bold text-center text-[var(--color-secondary)]">لقد تم تسجيل حضورك بنجاح</p>
                </div>
            </Modal>
        </div>
    )
}

export default SessionDetailsComponent;