'use client'

import { IUser } from "@/models/User";
import { ApiResponse, postData } from "@/utils/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export type LayoutForTypes = 'login' | 'signup' | 'forget-password'; 
export interface IAuthLayoutProps {
    layoutFor: LayoutForTypes;
}

export enum UserRolesEnum {
    student = "Student",
    doctor = "Doctor"
}
export interface IAuthFormInputsValue {
    name: string;
    email: string;
    password: string;
    role: UserRolesEnum;
}

const AuthLayout = ({ layoutFor }: IAuthLayoutProps) => {
    const router = useRouter();

    const [formValues, setFormValues] = useState<IAuthFormInputsValue>({
        name: "",
        email: "",
        password: "",
        role: UserRolesEnum.student
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const Login = async () => {
        try {
            const { success, msg, data }: ApiResponse<IUser> = await postData<IUser>({
                endpoint: '/auth/login',
                data: {
                    email: formValues?.email,
                    password: formValues?.password
                }
            }) as ApiResponse<IUser>; 

            if (success) {
                router.push('/')
                toast.success(msg || "مرحبا بعودتك");
            } else {
                toast.error(msg || "فشل في تسجيل الدخول");
            }
        } catch {}
    }

    const Signup = async () => {
        try {
            const { success, msg, data }: ApiResponse<IUser> = await postData<IUser>({
                endpoint: '/auth/signup',
                data: {
                    name: formValues?.name,
                    email: formValues?.email,
                    password: formValues?.password,
                    role: formValues?.role
                }
            }) as ApiResponse<IUser>; 

            if (success) {
                router.push('/')
                toast.success(msg || "تم غنشاء الحساب بنجاح");
            } else {
                toast.error(msg || "فشل في إنشاء الحساب ");
            }
        } catch {}
    }

    const ForgetPassword = async () => {}
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (layoutFor === 'login') await Login();
        if (layoutFor === 'signup') await Signup();
        if (layoutFor === 'forget-password') await ForgetPassword();
    };

    return (
        <div className="w-full flex justify-center items-center h-svh" dir="rtl">
            <div className="w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] p-3 flex flex-col gap-4">
                <div className="flex flex-col gap-1 w-full justify-center items-center text-[var(--color-secondary)]">
                    <svg fill="currentColor" height="50px" width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M255.946,83.759c-33.069,0-59.972,26.903-59.972,59.971c0,33.069,26.903,59.972,59.972,59.972 c33.068,0,59.971-26.903,59.971-59.972C315.917,110.662,289.014,83.759,255.946,83.759z M255.946,183.304 c-21.821,0-39.574-17.753-39.574-39.574c0-21.821,17.753-39.573,39.574-39.573c21.821,0,39.573,17.753,39.573,39.573 C295.519,165.551,277.767,183.304,255.946,183.304z"></path> </g> </g> <g> <g> <path d="M112.363,144.796c-27.175,0-49.283,22.108-49.283,49.283c0,27.175,22.108,49.283,49.283,49.283 c27.175,0,49.283-22.108,49.283-49.283S139.537,144.796,112.363,144.796z M112.363,222.963c-15.927,0-28.884-12.957-28.884-28.884 c0-15.927,12.957-28.884,28.884-28.884c15.927,0,28.884,12.958,28.884,28.884C141.247,210.005,128.29,222.963,112.363,222.963z"></path> </g> </g> <g> <g> <path d="M399.674,144.796c-27.174,0-49.283,22.108-49.283,49.283c0,27.175,22.109,49.283,49.283,49.283 c27.175,0,49.282-22.108,49.282-49.283S426.848,144.796,399.674,144.796z M399.674,222.963c-15.927,0-28.884-12.957-28.884-28.884 c0-15.927,12.957-28.884,28.884-28.884c15.926,0,28.883,12.958,28.883,28.884C428.557,210.005,415.6,222.963,399.674,222.963z"></path> </g> </g> <g> <g> <path d="M501.801,407.843h-28.677V332.75c0-40.5-32.95-73.45-73.451-73.45c-22.522,0-42.698,10.198-56.181,26.209 c-10.521-38.473-45.781-66.836-87.546-66.836c-41.729,0-76.956,28.381-87.451,66.874c-13.464-16.033-33.626-26.247-56.132-26.247 c-40.5,0-73.451,32.95-73.451,73.45v75.093H10.199C4.566,407.843,0,412.409,0,418.042c0,5.633,4.566,10.199,10.199,10.199h491.602 c5.632,0,10.199-4.566,10.199-10.199C512,412.409,507.433,407.843,501.801,407.843z M165.306,407.843H59.31V332.75 c0-29.252,23.799-53.051,53.052-53.051c29.193,0,52.943,23.799,52.943,53.051V407.843z M326.225,407.843H185.704v-98.421 c0-38.792,31.51-70.351,70.242-70.351c38.792,0,70.351,31.559,70.351,70.351L326.225,407.843z M452.725,407.842h-106.03v-77.865 c1.447-27.969,24.657-50.279,52.979-50.279c29.252,0,53.051,23.799,53.051,53.051V407.842z"></path> </g> </g> <g> <g> <path d="M207.08,329.54c-5.633,0-10.199,4.566-10.199,10.199v48.939c0,5.633,4.566,10.199,10.199,10.199 s10.199-4.566,10.199-10.199V339.74C217.279,334.108,212.713,329.54,207.08,329.54z"></path> </g> </g> <g> <g> <path d="M207.08,296.915c-5.633,0-10.199,4.566-10.199,10.199v2.175c0,5.633,4.566,10.199,10.199,10.199 s10.199-4.566,10.199-10.199v-2.175C217.279,301.481,212.713,296.915,207.08,296.915z"></path> </g> </g> </g></svg>
                    <p className="text-lg font-semibold">حضرني</p>
                </div>
                
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    { layoutFor === 'signup' && 
                        <div className="flex flex-col gap-2 w-full px-2">
                            <label htmlFor="name">الإسم</label>
                            <input 
                                id="name" 
                                type="text" 
                                value={formValues.name} 
                                onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                                className="border focus:outline-[var(--color-primary)] border-gray-500 rounded-md p-2"
                                required
                            />
                        </div>
                    }

                    <div className="flex flex-col gap-2 w-full px-2">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input 
                            id="email" 
                            type="email" 
                            value={formValues.email} 
                            onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                            className="border border-gray-500 rounded-md p-2 focus:outline-[var(--color-primary)]"
                            required
                        />
                    </div>

                    { layoutFor !== 'forget-password' && 
                        <div className="relative flex flex-col gap-2 w-full px-2">
                            <label htmlFor="password">كلمة المرور</label>
                            <input 
                                id="password" 
                                type={showPassword ? 'text' : 'password'}
                                value={formValues.password} 
                                onChange={(e) => setFormValues(prev => ({ ...prev, password: e.target.value }))}
                                className="border border-gray-500 rounded-md p-2 focus:outline-[var(--color-primary)]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute inset-y-0 top-8 left-5 flex items-center text-gray-400`}
                            >
                                { showPassword ? (
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                ) : (
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                )}
                            </button>
                        </div>
                    }

                    { layoutFor === 'signup' && 
                        <div className="flex flex-col gap-2 w-full px-2">
                            <label className="text-gray-900 font-medium">اختر الدور:</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio" 
                                        name="role" 
                                        value="Student"
                                        checked={formValues.role === UserRolesEnum.student}
                                        onChange={() => setFormValues(prev => ({ ...prev, role: UserRolesEnum.student }))}
                                        className="w-4 h-4 focus:outline-[var(--color-primary)] text-[var(--color-primary)] bg-gray-100 border-gray-300 focus:ring-[var(--color-secondary)] focus:ring-2"
                                    />
                                    <span className="ms-2 text-sm font-medium text-gray-900">طالب</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio" 
                                        name="role" 
                                        value="Doctor"
                                        checked={formValues.role === UserRolesEnum.doctor}
                                        onChange={() => setFormValues(prev => ({ ...prev, role: UserRolesEnum.doctor }))}
                                        className="w-4 h-4 focus:outline-[var(--color-primary)] text-[var(--color-primary)] bg-gray-100 border-gray-300 focus:ring-[var(--color-secondary)] focus:ring-2"
                                    />
                                    <span className="ms-2 text-sm font-medium text-gray-900">دكتور</span>
                                </label>
                            </div>
                        </div>
                    }

                    <button 
                        type="submit" 
                        className="mt-4 bg-[var(--color-primary)] text-white font-medium py-2 rounded-md hover:bg-[var(--color-secondary)] transition-colors"
                    >
                        {layoutFor === 'signup' ? "إنشاء حساب" : "تسجيل الدخول"}
                    </button>

                    <Link
                        className="font-semibold text-[var(--color-primary)] text-center hover:underline hover:text-[var(--color-secondary)]"
                        href={layoutFor === 'login' ? '/signup' : '/login'}
                    >
                        {layoutFor === 'login' ? 'ليس لديك حساب؟ إنشاء حساب' : 'لديك حساب؟ تسجيل الدخول'}
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default AuthLayout;
