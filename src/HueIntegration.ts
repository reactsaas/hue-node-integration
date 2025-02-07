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
import { setScene } from "./methods/setScene.js"
import { setLight } from "./methods/setLight.js";
import { setGradient } from "./methods/setGradient.js";
import { getGroups } from "./methods/getGroups.js";
import { setGroup } from "./methods/setGroup.js";
import { setGroups } from "./methods/setGroups.js";

export class HueIntegration {
  private apiKey: string;
  private bridgeIp: string;
  private axiosInstance: any; 
  private eventSource?: { close: () => void }; 

  constructor(apiKey: string, bridgeIp: string = "192.168.1.105") {
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

  connectBridge(appName: string): Promise<string> {
    return connectBridge(appName, this.bridgeIp);
  }

  async getBridgeInfo(): Promise<any> {
    return await getBridgeInfo(this.axiosInstance); 
  }

  async getTemperature(): Promise<any> {
    return await getTemperature(this.axiosInstance); 
  }

  async getMLightLevel(): Promise<any> {
    return await getMLightLevel(this.axiosInstance);
  }

  async getLights(): Promise<any> {
    return await getLights(this.axiosInstance); 
  }

  async getRooms(): Promise<any[]> { 
    return await getRooms(this.axiosInstance);
  }

  async getScenes(): Promise<any[]> { 
    return await getScenes(this.axiosInstance);
  }
  async setScene(sceneId: string): Promise<boolean> {
    return await setScene(this.axiosInstance, sceneId);
  }
  async setLight(
    lightId: string,
    brightness?: number,
    xyColor?: { x: number; y: number },
    isOn?: boolean
  ): Promise<boolean> {
    return await setLight(this.axiosInstance, lightId, brightness, xyColor, isOn);
  }
  async setGradient(lightId: string, gradientColors: { x: number; y: number }[], isOn?: boolean): Promise<boolean> {
    return await setGradient(this.axiosInstance, lightId, gradientColors, isOn);
  }
  async getGroups(): Promise<any[]> {
    return await getGroups(this.axiosInstance);
  }

  async setGroups(
    groupIds: string[],
    brightness?: number,
    xyColor?: { x: number; y: number },
    isOn?: boolean
  ): Promise<boolean> {
    return await setGroups(this.axiosInstance, groupIds, brightness, xyColor, isOn);
  }

  async setGroup(
    groupId: string,
    brightness?: number,
    xyColor?: { x: number; y: number },
    isOn?: boolean
  ): Promise<boolean> {
    return await setGroup(this.axiosInstance, groupId, brightness, xyColor, isOn);
  }

  startEventStream(
    onMessage: (data: any) => void,
    onError?: (error: any) => void
  ): void {
    if (this.eventSource) {
      console.warn("Event stream is already running.");
      return;
    }

    this.eventSource = startEventStream(
      this.bridgeIp,
      this.apiKey,
      onMessage,
      onError
    );
  }

  stopEventStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
      console.log("🔌 Event stream stopped.");
    } else {
      console.warn("No event stream to stop.");
    }
  }
}
