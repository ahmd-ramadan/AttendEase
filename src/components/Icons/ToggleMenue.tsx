import { SVGAttributes } from "react";

interface IToggleMenueIconProps extends SVGAttributes<HTMLOrSVGElement> {
    size: number;
    className?: string;
}

const ToggleMenueIcon = ({ size, className, ...rest } : IToggleMenueIconProps) => {
    return (
        <svg 
            {...rest } 
            width={`${size}px`} 
            height={`${size}px`} 
            className={`${className} cursor-pointer`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
                
}
export default ToggleMenueIcon;
