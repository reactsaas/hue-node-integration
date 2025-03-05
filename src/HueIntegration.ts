import axios from "axios";
import https from "https";

import { connectBridge } from "./methods/connectBridge.js";
import { getBridgeInfo } from "./methods/getBridgeInfo.js";
import { startEventStream } from "./methods/eventStream.js";
import { getTemperature } from "./methods/getTemperature.js";
import { getMLightLevel } from "./methods/getLightLevel.js";
import { getLights } from "./methods/getLights.js";
import { getLight } from "./methods/getLight.js";
import { getScenes } from "./methods/getScenes.js";
import { setScene } from "./methods/setScene.js";
import { setLight } from "./methods/setLight.js";
import { setLightPower } from "./methods/setLightPower.js";
import { setLightColor } from "./methods/setLightColor.js";
import { setGradient } from "./methods/setGradient.js";
import { setLightColorGradient } from "./methods/setLightColorGradient.js";
import { getGroups } from "./methods/getGroups.js";
import { setGroup } from "./methods/setGroup.js";
import { setGroups } from "./methods/setGroups.js";
import { getRooms } from "./methods/getRooms.js";
import { turnOffAllLights } from "./methods/turnoffAllLights.js";
import { turnOffAllLightsExceptPlugs } from "./methods/turnOffAllLightsExceptPlugs.js";

// https://developers.meethue.com/develop/application-design-guidance/using-https/
const certificate = `-----BEGIN CERTIFICATE-----
MIICMjCCAdigAwIBAgIUO7FSLbaxikuXAljzVaurLXWmFw4wCgYIKoZIzj0EAwIw
OTELMAkGA1UEBhMCTkwxFDASBgNVBAoMC1BoaWxpcHMgSHVlMRQwEgYDVQQDDAty
b290LWJyaWRnZTAiGA8yMDE3MDEwMTAwMDAwMFoYDzIwMzgwMTE5MDMxNDA3WjA5
MQswCQYDVQQGEwJOTDEUMBIGA1UECgwLUGhpbGlwcyBIdWUxFDASBgNVBAMMC3Jv
b3QtYnJpZGdlMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjNw2tx2AplOf9x86
aTdvEcL1FU65QDxziKvBpW9XXSIcibAeQiKxegpq8Exbr9v6LBnYbna2VcaK0G22
jOKkTqOBuTCBtjAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNV
HQ4EFgQUZ2ONTFrDT6o8ItRnKfqWKnHFGmQwdAYDVR0jBG0wa4AUZ2ONTFrDT6o8
ItRnKfqWKnHFGmShPaQ7MDkxCzAJBgNVBAYTAk5MMRQwEgYDVQQKDAtQaGlsaXBz
IEh1ZTEUMBIGA1UEAwwLcm9vdC1icmlkZ2WCFDuxUi22sYpLlwJY81Wrqy11phcO
MAoGCCqGSM49BAMCA0gAMEUCIEBYYEOsa07TH7E5MJnGw557lVkORgit2Rm1h3B2
sFgDAiEA1Fj/C3AN5psFMjo0//mrQebo0eKd3aWRx+pQY08mk48=
-----END CERTIFICATE-----`;

export class HueIntegration {
  private apiKey: string;
  private bridgeIp: string;
  private axiosInstance: any;
  private eventSource?: { close: () => void };

  constructor(apiKey: string, bridgeIp: string = "192.168.1.105") {
    this.apiKey = apiKey;
    this.bridgeIp = bridgeIp;

    // Create an Axios instance with the provided certificate for secure communication
    this.axiosInstance = axios.create({
      baseURL: `https://${this.bridgeIp}/clip/v2/resource`,
      httpsAgent: new https.Agent({
        ca: certificate,
        rejectUnauthorized: false,
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

  // New getLight method
  async getLight(lightId: string): Promise<any> {
    return await getLight(this.axiosInstance, lightId);
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
    xyColor?: { x: number; y: number },
    isOn?: boolean,
    brightness?: number,
    transition?: number
  ): Promise<boolean> {
    return await setLight(
      this.axiosInstance,
      lightId,
      xyColor,
      isOn,
      brightness,
      transition
    );
  }

  async setGradient(
    lightId: string,
    gradientColors: { x: number; y: number }[],
    isOn: boolean,
    brightness: number,
    transition: number
  ): Promise<boolean> {
    return await setGradient(
      this.axiosInstance,
      lightId,
      gradientColors,
      isOn,
      brightness,
      transition
    );
  }

  async setLightPower(lightId: string, isOn: boolean): Promise<boolean> {
    return await setLightPower(this.axiosInstance, lightId, isOn);
  }

  async setLightColorGradient(
    lightId: string,
    gradientColors: { x: number; y: number }[],
    brightness: number,
    transition: number
  ): Promise<boolean> {
    return await setLightColorGradient(
      this.axiosInstance,
      lightId,
      gradientColors,
      brightness,
      transition
    );
  }

  async setLightColor(
    lightId: string,
    xyColor?: { x: number; y: number },
    brightness?: number,
    transition?: number
  ): Promise<boolean> {
    return await setLightColor(this.axiosInstance, lightId, xyColor, brightness, transition);
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
    return await setGroups(
      this.axiosInstance,
      groupIds,
      brightness,
      xyColor,
      isOn
    );
  }

  async setGroup(
    groupId: string,
    brightness?: number,
    xyColor?: { x: number; y: number },
    isOn?: boolean
  ): Promise<boolean> {
    return await setGroup(
      this.axiosInstance,
      groupId,
      brightness,
      xyColor,
      isOn
    );
  }

  async turnOffAllLights(): Promise<boolean> {
    return await turnOffAllLights(this.axiosInstance);
  }
  async turnOffAllLightsExceptPlugs(): Promise<boolean> {
    return await turnOffAllLightsExceptPlugs(this.axiosInstance);
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
