import axios from "axios";
import https from "https";
// Import methods
import { connectBridge } from "./methods/connectBridge.js";
import { getBridgeInfo } from "./methods/getBridgeInfo.js";
import { startEventStream } from "./methods/eventStream.js";
import { getTemperature } from "./methods/getTemperature.js";
import { getMLightLevel } from "./methods/getLightLevel.js";
import { getLights } from "./methods/getLights.js";
import { getRooms } from "./methods/getRooms.js";
import { getScenes } from "./methods/getScenes.js";
import { setScene } from "./methods/setScene.js";
import { setLight } from "./methods/setLight.js";
import { setGradient } from "./methods/setGradient.js";
import { getGroups } from "./methods/getGroups.js";
import { setGroups } from "./methods/setGroups.js";
export class HueIntegration {
    constructor(apiKey, bridgeIp = "192.168.1.105") {
        this.apiKey = apiKey;
        this.bridgeIp = bridgeIp;
        // Create an Axios instance
        this.axiosInstance = axios.create({
            baseURL: `https://${this.bridgeIp}/clip/v2/resource`,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Ignore self-signed certificates
            }),
            headers: {
                "hue-application-key": this.apiKey,
                "Content-Type": "application/json",
            },
        });
    }
    connectBridge(appName) {
        return connectBridge(appName, this.bridgeIp);
    }
    async getBridgeInfo() {
        await getBridgeInfo(this.axiosInstance);
    }
    async getTemperature() {
        await getTemperature(this.axiosInstance);
    }
    async getMLightLevel() {
        await getMLightLevel(this.axiosInstance);
    }
    async getLights() {
        await getLights(this.axiosInstance);
    }
    async getRooms() {
        return await getRooms(this.axiosInstance);
    }
    async getScenes() {
        return await getScenes(this.axiosInstance);
    }
    async setScene(sceneId) {
        return await setScene(this.axiosInstance, sceneId);
    }
    async setLight(lightId, brightness, xyColor, isOn) {
        return await setLight(this.axiosInstance, lightId, brightness, xyColor, isOn);
    }
    async setGradient(lightId, gradientColors, isOn) {
        return await setGradient(this.axiosInstance, lightId, gradientColors, isOn);
    }
    async getGroups() {
        return await getGroups(this.axiosInstance);
    }
    async setGroups(groupIds, brightness, xyColor, isOn) {
        return await setGroups(this.axiosInstance, groupIds, brightness, xyColor, isOn);
    }
    startEventStream(onMessage, onError) {
        if (this.eventSource) {
            console.warn("Event stream is already running.");
            return;
        }
        this.eventSource = startEventStream(this.bridgeIp, this.apiKey, onMessage, onError);
    }
    stopEventStream() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = undefined;
            console.log("🔌 Event stream stopped.");
        }
        else {
            console.warn("No event stream to stop.");
        }
    }
}
//# sourceMappingURL=HueIntegration.js.map