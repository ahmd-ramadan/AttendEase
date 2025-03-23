import { ReactNode } from "react"


const CoursesLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full">
            { children }
        </div>
    )
}

export default CoursesLayout;