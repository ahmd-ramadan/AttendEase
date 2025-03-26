import { SVGAttributes } from "react";

interface IStudentsIconProps extends SVGAttributes<HTMLOrSVGElement> {
    size: number;
    className?: string;
}

const StudentsIcon = ({ size, className, ...rest } : IStudentsIconProps) => {
    return (
        <svg 
            {...rest } 
            width={`${size}px`} 
            height={`${size}px`} 
            className={`${className} cursor-pointer fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
        >
            <g>
                <circle style={{ fill: "currentColor" }} cx="256" cy="220.68" r="69.104"></circle> 
                <path style={{ fill: "currentColor" }} d="M365.408,423.912c-1.2-66.016-49.68-119.136-109.408-119.136s-108.224,53.136-109.408,119.136 H365.408z"></path>
                <circle style={{ fill: "currentColor" }} cx="82.192" cy="140.008" r="51.92"></circle> 
                <path style={{ fill: "currentColor" }} d="M164.4,292.696c-0.896-49.584-37.312-89.504-82.208-89.504S0.896,243.112,0,292.696H164.4z"></path> 
                <circle style={{ fill: "currentColor" }} cx="429.792" cy="140.008" r="51.92"></circle>
                <path style={{ fill: "currentColor" }} d="M512,292.696c-0.896-49.584-37.312-89.504-82.208-89.504s-81.296,39.92-82.208,89.504H512z"></path> 
            </g> 
        </svg>
    )
}
export default StudentsIcon;