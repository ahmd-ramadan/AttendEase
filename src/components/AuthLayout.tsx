'use client'

import { IUser } from "@/interfaces";
import { ApiResponse, postData } from "@/utils/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import LogoIcon from "./Icons/Logo";
import EyeOnIcon from "./Icons/EyeOn";
import EyeOffIcon from "./Icons/EyeOff";
import { UserRolesEnum } from "@/enums";
import { AuthLayoutTypes } from "@/types";

export interface IAuthLayoutProps {
    layoutFor: AuthLayoutTypes;
}

export interface IAuthFormInputsValue {
    name: string;
    email: string;
    password: string;
    role: UserRolesEnum;
}

const AuthLayout = ({ layoutFor }: IAuthLayoutProps) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<IAuthFormInputsValue>({
        name: "",
        email: "",
        password: "",
        role: UserRolesEnum.student
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const Login = async () => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }

    const Signup = async () => {
        try {
            setIsLoading(true)

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
        } finally {
            setIsLoading(false);
        }
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
                    <LogoIcon size={50} />
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
                                disabled={isLoading}
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute inset-y-0 top-8 left-5 flex items-center text-gray-400`}
                            >
                                { showPassword ? (
                                        <EyeOnIcon size={20} />
                                    ) : (
                                        <EyeOffIcon size={20} />
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
                        disabled={isLoading} 
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
