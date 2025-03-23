import { ReactNode } from "react"


const CourseDetailsLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full">
            { children }
        </div>
    )
}

export default CourseDetailsLayout;