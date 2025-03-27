import { RandomColors } from "@/enums";

const colorArray: string[] = Object.values(RandomColors);  

export const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex];
};