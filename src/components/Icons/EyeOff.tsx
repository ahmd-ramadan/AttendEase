import { SVGAttributes } from "react";

interface IEyeOffProps extends SVGAttributes<HTMLOrSVGElement> {
    size: number;
    className?: string;
}

const EyeOffIcon = ({ size, className, ...rest } : IEyeOffProps) => {
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
                <path d="M9.60997 9.60714C8.05503 10.4549 7 12.1043 7 14C7 16.7614 9.23858 19 12 19C13.8966 19 15.5466 17.944 16.3941 16.3878M21 14C21 9.02944 16.9706 5 12 5C11.5582 5 11.1238 5.03184 10.699 5.09334M3 14C3 11.0069 4.46104 8.35513 6.70883 6.71886M3 3L21 21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
            </g>
        </svg>
                                
    )
}
export default EyeOffIcon;
                                