import { SVGAttributes } from "react";

interface IEyeOnProps extends SVGAttributes<HTMLOrSVGElement> {
    size: number;
    className?: string;
}

const EyeOnIcon = ({ size, className, ...rest } : IEyeOnProps) => {
    return (
        <svg 
            {...rest } 
            width={`${size}px`} 
            height={`${size}px`} 
            className={`${className} cursor-pointer`}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
            </g>
        </svg>
    )
}
export default EyeOnIcon;
                                