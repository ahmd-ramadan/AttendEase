import { SVGAttributes } from "react";

interface IBagIconProps extends SVGAttributes<HTMLOrSVGElement> {
    size: number;
    className?: string;
}

const BagIcon = ({ size, className, ...rest } : IBagIconProps) => {
    return (
        <svg 
            {...rest } 
            width={`${size}px`} 
            height={`${size}px`} 
            className={`${className} cursor-pointer`}
            fill="currentColor" 
            version="1.1" 
            id="Capa_1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 442 442"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <path d="M418.609,94.182H290.283V55.057c0-5.523-4.478-10-10-10H161.717c-5.523,0-10,4.477-10,10v39.126H23.391 C10.493,94.182,0,104.675,0,117.573v74.391v181.589c0,12.897,10.493,23.39,23.391,23.39h395.219 c12.897,0,23.391-10.493,23.391-23.39V191.964v-74.391C442,104.675,431.507,94.182,418.609,94.182z M171.717,65.057h98.566v29.126 h-98.566V65.057z M20,117.573c0-1.87,1.521-3.391,3.391-3.391h395.219c1.869,0,3.391,1.521,3.391,3.391v74.391 c0,17.783-14.468,32.251-32.251,32.251H252.785v-33.234c0-5.523-4.478-10-10-10h-43.57c-5.523,0-10,4.477-10,10v33.234H52.251 C34.468,224.215,20,209.747,20,191.964V117.573z M209.215,244.215h23.57v11.449c0,6.499-5.287,11.785-11.785,11.785 c-6.499,0-11.785-5.287-11.785-11.785V244.215z M209.215,224.215v-23.234h23.57v23.234H209.215z M418.609,376.943H23.391 c-1.87,0-3.391-1.521-3.391-3.39V233.028c8.89,6.997,20.087,11.187,32.251,11.187h136.963v11.449 c0,17.526,14.259,31.785,31.785,31.785s31.785-14.259,31.785-31.785v-11.449h136.964c12.164,0,23.362-4.19,32.251-11.187v140.525 C422,375.422,420.479,376.943,418.609,376.943z"></path> 
            </g>
        </svg>
    )
}
export default BagIcon;
                                