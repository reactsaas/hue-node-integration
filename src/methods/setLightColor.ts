import { AxiosInstance } from "axios";

export async function setLightColor(
  axiosInstance: AxiosInstance,
  lightId: string,
  xyColor?: { x: number; y: number },
  brightness?: number,
  transition?: number
): Promise<boolean> {
  try {
    const requestBody: any = {};

    if (brightness !== undefined) {
      requestBody.dimming = { brightness };
    }
    if (xyColor) {
      requestBody.color = { xy: { x: xyColor.x, y: xyColor.y } };
    }
    if (transition && transition > 0) {
      requestBody.dynamics = { duration: transition };
    }

    if (Object.keys(requestBody).length === 0) {
      console.error("No color values provided for update!");
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
    console.error(`Failed to update light color (${lightId}):`, err.message);
    if (err.response) {
      console.error("Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}
