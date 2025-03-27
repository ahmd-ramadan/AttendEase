'use client'

import { ICourse, ISession,  ITokenPayload } from "@/interfaces";
import { useState } from "react";
import AddSessionComponent from "./AddSession";
import Modal from "../Modal";

interface IAddSessionBtnProps {
    userData: ITokenPayload | null;
    isSessionsPage?: boolean;
    sessions?: ISession[];
    setSessions?: (sessions: ISession[]) => void;
    course?: ICourse

}

const AddSessionBtn = ({
    userData,
    isSessionsPage = false,
    sessions,
    setSessions,
    course
}: IAddSessionBtnProps) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState<boolean>(false);
    const closeAddSessionModal = () => { setIsAddSessionModalOpen(false) }

    if ( userData && userData.role === 'Doctor') {
        return (
            <div
                className="w-full"
                dir="ltr"
            >
                <button
                    disabled={isLoading}
                    onClick={() => {
                        setIsAddSessionModalOpen(true)
                    }}
                    className="bg-[var(--color-primary)] px-6 py-2 rounded-md border-2 border-[var(--color-primary)] text-white hover:text-[var(--color-primary)] hover:bg-transparent"
                >
                    إضافة جلسة جديد
                </button>

                <Modal
                    title={"إضافة جلسة جديد"}
                    isOpen={isAddSessionModalOpen}
                    closeModal={closeAddSessionModal}
                >
                    <AddSessionComponent 
                        status={'add'} 
                        isSessionsPage={isSessionsPage}
                        sessions={sessions} 
                        setSessions={setSessions}
                        course={course}

                    />
                </Modal>
            </div>
        ) 
    } else {
        return null
    }
}

export default AddSessionBtn;