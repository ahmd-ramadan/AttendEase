import { ReactNode } from "react"


const SessionDetailsLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full">
            { children }
        </div>
    )
}

export default SessionDetailsLayout;