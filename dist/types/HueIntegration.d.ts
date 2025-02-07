export declare class HueIntegration {
    private apiKey;
    private bridgeIp;
    private axiosInstance;
    private eventSource?;
    constructor(apiKey: string, bridgeIp?: string);
    connectBridge(appName: string): Promise<string>;
    getBridgeInfo(): Promise<void>;
    getTemperature(): Promise<void>;
    getMLightLevel(): Promise<void>;
    getLights(): Promise<void>;
    getRooms(): Promise<any[]>;
    getScenes(): Promise<any[]>;
    setScene(sceneId: string): Promise<boolean>;
    setLight(lightId: string, brightness?: number, xyColor?: {
        x: number;
        y: number;
    }, isOn?: boolean): Promise<boolean>;
    setGradient(lightId: string, gradientColors: {
        x: number;
        y: number;
    }[], isOn?: boolean): Promise<boolean>;
    getGroups(): Promise<any[]>;
    setGroups(groupIds: string[], brightness?: number, xyColor?: {
        x: number;
        y: number;
    }, isOn?: boolean): Promise<boolean>;
    startEventStream(onMessage: (data: any) => void, onError?: (error: any) => void): void;
    stopEventStream(): void;
}
