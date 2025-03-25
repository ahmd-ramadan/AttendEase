'use client'

import { ISession } from "@/models/Session";
import { deleteData, postData } from "@/utils/apiService";
import { ITokenPayload } from "@/utils/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { formatDate } from "@/utils/date";
import Spinner from "./Spinner";
import Modal from "./Modal";
import AddSessionComponent from "./AddSession";

interface ISessionDetailsLayoutProps {
    session: ISession | null;
    setSession: (session: ISession) => void;
    isLoggedInUser: boolean;
    userData: ITokenPayload | null
}
export type SessionUpdateStatusTypes = 'update' | 'add' | null;

const SessionDetailsComponent = ({ session, setSession, isLoggedInUser, userData }: ISessionDetailsLayoutProps) => {
    const router = useRouter()
    
    const [selectedSession, setSelectedSession] = useState<ISession>(session as ISession)
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState<boolean>(false);
    const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] = useState<boolean>(false);
    
    const [sessionUpdateStatus, setSessionUpdateStatus] = useState<SessionUpdateStatusTypes>(null);
    const closeAddSessionModal = () => { setIsAddSessionModalOpen(false) }
    const closeDeleteSessionModal = () => { setIsDeleteSessionModalOpen(false) }

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
                endpoint: `/session/${selectedSession?._id}`,
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
                
                            <dd className="text-xs text-gray-700">{students.length} طالب حاضر</dd>
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

                        <div className="flex items-center gap-2">
                            <dt className="text-gray-700 text-lg">
                                <span className="sr-only"> Published at </span>
                                <svg  className="size-6" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier"> 
                                        <path fill="currentColor" fill-rule="evenodd" d="M161.960546,159.843246 L164.399107,161.251151 C164.637153,161.388586 164.71416,161.70086 164.580127,161.933013 C164.442056,162.172159 164.144067,162.258604 163.899107,162.117176 L161.419233,160.68542 C161.165323,160.8826 160.846372,161 160.5,161 C159.671573,161 159,160.328427 159,159.5 C159,158.846891 159.417404,158.291271 160,158.085353 L160,153.503423 C160,153.22539 160.231934,153 160.5,153 C160.776142,153 161,153.232903 161,153.503423 L161,158.085353 C161.582596,158.291271 162,158.846891 162,159.5 C162,159.6181 161.986351,159.733013 161.960546,159.843246 Z M160.5,169 C165.746705,169 170,164.746705 170,159.5 C170,154.253295 165.746705,150 160.5,150 C155.253295,150 151,154.253295 151,159.5 C151,164.746705 155.253295,169 160.5,169 Z M160.5,168 C165.19442,168 169,164.19442 169,159.5 C169,154.80558 165.19442,151 160.5,151 C155.80558,151 152,154.80558 152,159.5 C152,164.19442 155.80558,168 160.5,168 Z" transform="translate(-151 -150)"></path> 
                                    </g>
                                </svg>
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
                </div>
            </div>

            {/* Sessions Students Table */}
            { userData && userData.role === 'Doctor' && 
                <div className="w-full flex flex-col gap-4 p-2 border-b-2 border-[var(--color-secondary)] rounded-md">
                    <h3 className="text-xl font-bold text-[var(--color-secondary)]">الطلاب الحاضرين</h3>
                
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        إسم الطالب
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        الإيميل
                                    </th>
                                    {/* <th scope="col" className="px-6 py-3">
                                        عدد 
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {  students.length > 0 ? (
                                        students.map(({ name, email }, idx) => (
                                            <tr
                                                key={idx}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            >
                                                <th
                                                    scope="row"
                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    {name}
                                                </th>
                                                <td className="px-6 py-4">{email}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-4 text-center">
                                                <p className="text-gray-500 text-lg font-bold">لا يوجد أي حضور حتى الأن</p>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                </div>
            }

            <Modal
                title={sessionUpdateStatus === 'add' ? "إضافة جلسة جديد" : "تعديل الجلسة"}
                isOpen={isAddSessionModalOpen}
                closeModal={closeAddSessionModal}
            >
                <AddSessionComponent 
                    status={sessionUpdateStatus} 
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
        </div>
    )
}

export default SessionDetailsComponent;