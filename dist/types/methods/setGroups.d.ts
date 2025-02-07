import { AxiosInstance } from "axios";
export declare function setGroups(axiosInstance: AxiosInstance, groupIds: string[], // Array of group IDs
brightness?: number, // Optional brightness (0-100)
xyColor?: {
    x: number;
    y: number;
}, // Optional XY color
isOn?: boolean): Promise<boolean>;
