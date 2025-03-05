import axios, { AxiosInstance } from "axios";

/**
 * V1 version of setLight.
 * 
 * - Converts brightness from a 0–100 scale to Hue API v1 brightness (1–254).
 * - Converts transition time from milliseconds to deciseconds (1 decisecond = 100 ms).
 * - Expects color as an XY array.
 * - Uses the /lights/{lightId}/state endpoint.
 */
export async function setLightV1(
  axiosInstance: AxiosInstance,
  lightId: string,
  xyColor?: { x: number; y: number },
  isOn?: boolean,
  brightness?: number, // expected value in 0–100 scale
  transition?: number  // transition in milliseconds
): Promise<boolean> {
  try {
    const requestBody: any = {};

    // Handle on/off state
    if (isOn !== undefined) {
      requestBody.on = isOn;
      if (isOn) {
        if (brightness !== undefined) {
          // Convert brightness from 0–100 to 1–254
          const bri = Math.max(1, Math.round((brightness / 100) * 254));
          requestBody.bri = bri;
        }
        if (xyColor) {
          // V1 expects an array for XY color.
          requestBody.xy = [xyColor.x, xyColor.y];
        }
        if (transition && transition > 0) {
          // Convert transition from ms to deciseconds.
          requestBody.transitiontime = Math.round(transition / 100);
        }
      }
    } else {
      // If isOn isn't provided, update other parameters if given.
      if (brightness !== undefined) {
        const bri = Math.max(1, Math.round((brightness / 100) * 254));
        requestBody.bri = bri;
      }
      if (xyColor) {
        requestBody.xy = [xyColor.x, xyColor.y];
      }
      if (transition && transition > 0) {
        requestBody.transitiontime = Math.round(transition / 100);
      }
    }

    if (Object.keys(requestBody).length === 0) {
      console.error("No values provided for update!");
      return false;
    }

    const response = await axiosInstance.put(`/lights/${lightId}/state`, requestBody);

    if (response.status === 200) {
      // V1 API typically returns an array of success objects.
      const data = response.data;
      if (Array.isArray(data) && data.every(item => item.success)) {
        return true;
      }
      return true; // Fallback.
    } else {
      console.warn(`Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (err: any) {
    console.error(`Failed to update light (${lightId}):`, err.message);
    if (err.response) {
      console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}

export async function setGradientV1(
  axiosInstance: AxiosInstance,
  lightId: string,
  gradientColors: { x: number; y: number }[], // Array of XY color points
  isOn: boolean, // Desired power state
  brightness: number, // Brightness on 0–100 scale
  transition: number  // Transition time in milliseconds
): Promise<boolean> {
  try {
    if (!gradientColors || gradientColors.length < 2 || gradientColors.length > 5) {
      console.error("Gradient requires between 2 and 5 color points.");
      return false;
    }

    gradientColors.forEach((color, index) => {
      console.log(`🎨 Point ${index + 1}: (${color.x}, ${color.y})`);
    });

    // Convert brightness from 0–100 to 1–254
    const bri = Math.max(1, Math.round((brightness / 100) * 254));

    // Convert transition from milliseconds to deciseconds
    const transitiontime = transition && transition > 0 ? Math.round(transition / 100) : undefined;

    // Build the request payload for V1.
    const requestBody: any = {
      on: isOn,
      bri,
      gradient: {
        points: gradientColors.map((xy) => ({ xy: [xy.x, xy.y] }))
      }
    };

    if (transitiontime !== undefined) {
      requestBody.transitiontime = transitiontime;
    }

    const response = await axiosInstance.put(`/lights/${lightId}/state`, requestBody);

    if (response.status === 200) {
      console.log(`Gradient applied to light: ${lightId}`);
      const data = response.data;
      if (Array.isArray(data) && data.every((item: any) => item.success)) {
        return true;
      }
      return true;
    } else {
      console.warn(`Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (err: any) {
    console.error(`Failed to set gradient on light (${lightId}):`, err.message);
    if (err.response) {
      console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}

/**
 * HueIntegrationV1 class for Hue API v1.
 * 
 * This class creates an Axios instance pointed to the V1 endpoint
 * (http://<bridge_ip>/api/<username>) and exposes methods like connectBridge,
 * getLights, getLight, setLight, and setLightPower.
 */
export class HueIntegrationV1 {
  private apiKey: string;
  private bridgeIp: string;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string, bridgeIp: string = "192.168.1.105") {
    this.apiKey = apiKey;
    this.bridgeIp = bridgeIp;
    // Create an Axios instance for v1 endpoints.
    this.axiosInstance = axios.create({
      baseURL: `http://${this.bridgeIp}/api/${this.apiKey}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Connects to the Hue Bridge by registering the application.
   * This will POST to /api and return the generated username.
   */
  async connectBridge(appName: string): Promise<string> {
    try {
      const response = await axios.post(`http://${this.bridgeIp}/api`, { devicetype: appName });
      if (response.data && Array.isArray(response.data) && response.data[0].success) {
        const username = response.data[0].success.username;
        this.apiKey = username;
        // Reinitialize axiosInstance with the new API key.
        this.axiosInstance = axios.create({
          baseURL: `http://${this.bridgeIp}/api/${this.apiKey}`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        return username;
      } else {
        throw new Error("Failed to register with the Hue Bridge.");
      }
    } catch (err: any) {
      console.error("Error registering with the Hue Bridge:", err.message);
      throw err;
    }
  }

  async getBridgeInfo(): Promise<any> {
    return await this.axiosInstance.get("/config");
  }

  async getLights(): Promise<any> {
    return await this.axiosInstance.get("/lights");
  }

  async getLight(lightId: string): Promise<any> {
    return await this.axiosInstance.get(`/lights/${lightId}`);
  }

  /**
   * Sets the light state using the V1 API.
   * Transforms values as needed for Hue API v1.
   */
  async setLight(
    lightId: string,
    xyColor?: { x: number; y: number },
    isOn?: boolean,
    brightness?: number,
    transition?: number
  ): Promise<boolean> {
    return await setLightV1(this.axiosInstance, lightId, xyColor, isOn, brightness, transition);
  }

    /**
   * Sets the gradient on a light using the V1 API.
   * Transforms values as needed.
   */
    async setGradient(
      lightId: string,
      gradientColors: { x: number; y: number }[],
      isOn: boolean,
      brightness: number,
      transition: number
    ): Promise<boolean> {
      return await setGradientV1(this.axiosInstance, lightId, gradientColors, isOn, brightness, transition);
    }
  

  /**
   * Sets the power (on/off) state of a light.
   */
  async setLightPower(lightId: string, isOn: boolean): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put(`/lights/${lightId}/state`, { on: isOn });
      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data) && data.every((item: any) => item.success)) {
          return true;
        }
        return true;
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
        return false;
      }
    } catch (err: any) {
      console.error(`Failed to update light power (${lightId}):`, err.message);
      return false;
    }
  }

  // Additional methods (setLightColor, setGradient, etc.) can be added as needed.
}
