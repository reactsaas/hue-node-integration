"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HueIntegration = void 0;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
// Import methods
const connectBridge_js_1 = require("./methods/connectBridge.js");
const getBridgeInfo_js_1 = require("./methods/getBridgeInfo.js");
const eventStream_js_1 = require("./methods/eventStream.js");
const getTemperature_js_1 = require("./methods/getTemperature.js");
const getLightLevel_js_1 = require("./methods/getLightLevel.js");
const getLights_js_1 = require("./methods/getLights.js");
const getRooms_js_1 = require("./methods/getRooms.js");
const getScenes_js_1 = require("./methods/getScenes.js");
const setScene_js_1 = require("./methods/setScene.js");
const setLight_js_1 = require("./methods/setLight.js");
const setGradient_js_1 = require("./methods/setGradient.js");
const getGroups_js_1 = require("./methods/getGroups.js");
const setGroups_js_1 = require("./methods/setGroups.js");
class HueIntegration {
    constructor(apiKey, bridgeIp = "192.168.1.105") {
        this.apiKey = apiKey;
        this.bridgeIp = bridgeIp;
        // Create an Axios instance
        this.axiosInstance = axios_1.default.create({
            baseURL: `https://${this.bridgeIp}/clip/v2/resource`,
            httpsAgent: new https_1.default.Agent({
                rejectUnauthorized: false, // Ignore self-signed certificates
            }),
            headers: {
                "hue-application-key": this.apiKey,
                "Content-Type": "application/json",
            },
        });
    }
    connectBridge(appName) {
        return (0, connectBridge_js_1.connectBridge)(appName, this.bridgeIp);
    }
    async getBridgeInfo() {
        await (0, getBridgeInfo_js_1.getBridgeInfo)(this.axiosInstance);
    }
    async getTemperature() {
        await (0, getTemperature_js_1.getTemperature)(this.axiosInstance);
    }
    async getMLightLevel() {
        await (0, getLightLevel_js_1.getMLightLevel)(this.axiosInstance);
    }
    async getLights() {
        await (0, getLights_js_1.getLights)(this.axiosInstance);
    }
    async getRooms() {
        return await (0, getRooms_js_1.getRooms)(this.axiosInstance);
    }
    async getScenes() {
        return await (0, getScenes_js_1.getScenes)(this.axiosInstance);
    }
    async setScene(sceneId) {
        return await (0, setScene_js_1.setScene)(this.axiosInstance, sceneId);
    }
    async setLight(lightId, brightness, xyColor, isOn) {
        return await (0, setLight_js_1.setLight)(this.axiosInstance, lightId, brightness, xyColor, isOn);
    }
    async setGradient(lightId, gradientColors, isOn) {
        return await (0, setGradient_js_1.setGradient)(this.axiosInstance, lightId, gradientColors, isOn);
    }
    async getGroups() {
        return await (0, getGroups_js_1.getGroups)(this.axiosInstance);
    }
    async setGroups(groupIds, brightness, xyColor, isOn) {
        return await (0, setGroups_js_1.setGroups)(this.axiosInstance, groupIds, brightness, xyColor, isOn);
    }
    startEventStream(onMessage, onError) {
        if (this.eventSource) {
            console.warn("Event stream is already running.");
            return;
        }
        this.eventSource = (0, eventStream_js_1.startEventStream)(this.bridgeIp, this.apiKey, onMessage, onError);
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
exports.HueIntegration = HueIntegration;
//# sourceMappingURL=HueIntegration.js.map