import { AxiosInstance } from "axios";
export declare function setLight(axiosInstance: AxiosInstance, lightId: string, brightness?: number, // Optional brightness (0-100)
xyColor?: {
    x: number;
    y: number;
}, // Optional XY color
isOn?: boolean): Promise<boolean>;
