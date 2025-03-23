import { ReactNode } from "react"


const LoginLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full">
            { children }
        </div>
    )
}

export default LoginLayout;