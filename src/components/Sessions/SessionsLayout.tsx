import { ISession } from "@/models/Session";
import { ITokenPayload } from "@/utils/token";
import SessionCard from "./SessionCard";
import AddSessionBtn from "./AddSessionBtn";

interface ISessionLayoutProps {
    sessions: ISession[];
    setSessions: (session: ISession[]) => void;
    isLoggedInUser: boolean;
    userData: ITokenPayload | null
}
export type SessionUpdateStatusTypes = 'update' | 'add' | null;

const SessionsLayout = ({ 
    sessions, 
    setSessions, 
    isLoggedInUser, 
    userData 
}: ISessionLayoutProps) => {

    return (
        <div className="mt-8 flex flex-col gap-3 p-2">
            {/* For Doctor Add Session Btn */}
            <AddSessionBtn 
                isLoggedInUser={isLoggedInUser}
                userData={userData}
                isSessionsPage={true}
                sessions={sessions}
                setSessions={setSessions}
            />

            <div className="w-full" dir="rtl">
                <h1 className="text-xl font-bold text-[var(--color-secondary)]">كل الجلسات</h1>
            </div>

            {/* For Show All Sessions */}
            { sessions && sessions.length ? 
                <div 
                    className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6"
                >
                    { sessions.map((session, idx) => (
                        <SessionCard 
                            key={idx}
                            session={session}
                            isLoggedInUser={isLoggedInUser}
                            userData={userData}
                            sessions={sessions}
                            setSessions={setSessions}
                        />
                    ))}
                </div>
                : <div className="flex justify-center w-full mt-20">
                    <p className="text-gray-500 text-lg font-bold text-center">لا يوجد أي جلسات في الوقت الحالي !</p>
                </div>
            }
        
        </div>
    )
}

export default SessionsLayout;