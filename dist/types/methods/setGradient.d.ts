import { AxiosInstance } from "axios";
export declare function setGradient(axiosInstance: AxiosInstance, lightId: string, gradientColors: {
    x: number;
    y: number;
}[], // Array of XY color points
isOn?: boolean, // Default ON
brightness?: number): Promise<boolean>;
