import { ITokenPayload } from "@/utils/token";
import Link from "next/link";
import HomePicIcon from "./Icons/HomePic";

interface IHomeBodyProps {
    userData: ITokenPayload | null;
    isLoggedInUser: boolean
}

const MainBody = ({ isLoggedInUser, userData }: IHomeBodyProps) => {
    return (
        <section className="bg-white lg:grid lg:h-screen lg:place-content-center" dir="ltr">
            <div
                className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
            >
                <HomePicIcon />

                <div className="max-w-prose text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        نظام متكامل لتسجيل الحضور والغياب 
                        {/* <strong className="text-[var(--color-secondary)]"> increase </strong>
                        conversions */}
                    </h1>
      
                    <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                        استمتع بسهولة متابعة حضور الطلاب بدقة عالية وتقارير مفصلة تدعم إدارة الوقت وتنظيم الجداول.
                    </p>
      
                    <div className="mt-4 w-full justify-center flex gap-4 sm:mt-6">
                        <Link
                            href={ isLoggedInUser ? '/courses' : '/login' }
                            className="inline-block rounded border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-[var(--color-secondary)] hover:border-[var(--color-secondary)]" 
                            
                        >
                            { isLoggedInUser ? "تصفح الكورسات" : "سجل الأن" }
                        </Link>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default MainBody;