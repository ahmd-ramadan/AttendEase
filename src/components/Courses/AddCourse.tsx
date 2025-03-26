'use client'

import { ICourse } from "@/models/Course";
import { postData, putData } from "@/utils/apiService";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import { CourseUpdateStatusTypes } from "./CourseCard";

interface IAddCourseComponentProps {
    isSingleCourse?: boolean;
    status: CourseUpdateStatusTypes;
    updatedCourse?: ICourse;
    setUpdatedCourse?(course: ICourse): void;
    courses?: ICourse[];
    setCourses?: (courses: ICourse[]) => void;

}
const AddCourseComponent = ({ isSingleCourse = false, status, updatedCourse, setUpdatedCourse, courses, setCourses }: IAddCourseComponentProps) => {

    const [courseTitle, setCourseTitle] = useState<string>(status === 'update' ? updatedCourse?.title || "" : "");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();

        if (courseTitle.length <= 4) {
            toast.error("ادخل عنوان معبر علي الأقل 5 أحرف");
            return null;
        }
        
        try {
            setIsLoading(true);
            const { success, msg, data: newCourse }: any = status === 'add' ? await postData({
                endpoint: '/course',
                data: {
                    title: courseTitle
                }
            }) : await putData({
                endpoint: `/course/${updatedCourse?._id}`,
                data: {
                    title: courseTitle
                }
            })
            console.log(newCourse);
            if (success) {
                toast.success(msg || "تم إضافة الكورس بنجاح");
                if (isSingleCourse) {
                    if (status === 'update' && setUpdatedCourse) setUpdatedCourse(newCourse);
                }
                else {
                    if (status === 'add' && courses && setCourses) setCourses([ ...courses, newCourse ]);
                    if (status === 'update' && courses && setCourses) setCourses(courses.map(c => c._id.toString() === newCourse._id.toString() ? newCourse : c));
                }
            } else {
                toast.error(msg ||  "فشلت عملية إضافة كورس جديد");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <form  className="flex flex-col gap-4" onSubmit={onAddCourse}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">عنوان الكورس</label>
                    <input 
                        id="title" type="text" 
                        value={courseTitle} 
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="border focus:outline-[var(--color-primary)] border-gray-500 rounded-md p-2"
                        required
                    />
                </div>
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

export default AddCourseComponent;