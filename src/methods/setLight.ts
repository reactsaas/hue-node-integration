import { AxiosInstance } from "axios";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


/**
 * @deprecated Use `setLightPower` and `setLightColor` instead.
 * 
 * Warning: Setting color and on/off state together while the light is off might not always work.
 * Turning on the light first and then changing its color is recommended.
 */
export async function setLight(
  axiosInstance: AxiosInstance,
  lightId: string,
  xyColor?: { x: number; y: number }, // Optional XY color
  isOn?: boolean,                    // Optional On/Off state
  brightness?: number,               // Optional brightness (0-100)
  transition?: number                // Optional transition time (verify if in ms or seconds)
): Promise<boolean> {
  try {
    const requestBody: any = {};

    // If isOn is defined, handle it separately
    if (isOn !== undefined) {
      requestBody.on = { on: isOn };

      if (isOn) {
        // When turning on, include brightness, color, and dynamics if provided
        if (brightness !== undefined) {
          // Optionally, ensure brightness is an integer if required by the API
          requestBody.dimming = { brightness };
        }
        if (xyColor) {
          requestBody.color = { xy: { x: xyColor.x, y: xyColor.y } };
        }
        if (transition && transition > 0) {
          // If the API expects seconds, convert to the proper unit here
          requestBody.dynamics = { duration: transition };
        }
      }
      // When turning off, we intentionally omit brightness/color/dynamics to avoid conflicts
    } else {
      // If isOn is not specified, update other parameters if provided
      if (brightness !== undefined) {
        requestBody.dimming = { brightness };
      }
      if (xyColor) {
        requestBody.color = { xy: { x: xyColor.x, y: xyColor.y } };
      }
      if (transition && transition > 0) {
        requestBody.dynamics = { duration: transition };
      }
    }

    if (Object.keys(requestBody).length === 0) {
      console.error("No values provided for update!");
      return false;
    }

    const response = await axiosInstance.put(`/light/${lightId}`, requestBody);

    if (response.status === 200) {
      return true;
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
