export declare const startEventStream: (bridgeIp: string, apiKey: string, onMessage: (data: any) => void, onError?: (error: any) => void) => {
    close: () => void;
};
