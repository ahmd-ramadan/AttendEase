import { ReactNode } from "react"


const SessionsLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full">
            { children }
        </div>
    )
}

export default SessionsLayout;