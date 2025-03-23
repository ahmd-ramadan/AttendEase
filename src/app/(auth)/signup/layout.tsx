import { ReactNode } from "react"


const SignupLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full">
            { children }
        </div>
    )
}

export default SignupLayout;