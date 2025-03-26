'use client'

import { ITokenPayload } from "@/utils/token";
import { useState } from "react";
import Modal from "../Modal";
import AddCourseComponent from "./AddCourse";
import { ICourse } from "@/models/Course";

interface IAddCourseBtnProps {
    isLoggedInUser: boolean;
    userData: ITokenPayload | null;
    courses?: ICourse[];
    setCourses?: (courses: ICourse[]) => void;
}

const AddCourseBtn = ({
    isLoggedInUser,
    userData,
    courses,
    setCourses,
}: IAddCourseBtnProps) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState<boolean>(false);
    const closeAddCourseModal = () => { setIsAddCourseModalOpen(false) }

    if (isLoggedInUser && userData && userData.role === 'Doctor' ) {
        return (
            <div
                className="w-full"
                dir="ltr"
            >
                <button
                    disabled={isLoading}
                    onClick={() => {
                        setIsAddCourseModalOpen(true)
                    }}
                    className="bg-[var(--color-primary)] px-6 py-2 rounded-md border-2 border-[var(--color-primary)] text-white hover:text-[var(--color-primary)] hover:bg-transparent"
                >
                    إضافة كورس جديد
                </button>

                <Modal
                    title={"إضافة كورس جديد"}
                    isOpen={isAddCourseModalOpen}
                    closeModal={closeAddCourseModal}
                >
                    <AddCourseComponent
                        status={'add'} 
                        courses={courses} 
                        setCourses={setCourses}
                    />
                </Modal>
            </div>
        ) 
    } else {
        return null;
    }
}
export default AddCourseBtn