import { AxiosInstance } from "axios";

export async function getLight(axiosInstance: AxiosInstance, lightId: string): Promise<any | null> {
  try {
    // Fetch a specific light by its ID.
    const response = await axiosInstance.get(`/light/${lightId}`);
    const light = response.data.data;
    if (!light) {
      console.log(`Light ${lightId} not found on the Hue Bridge.`);
      return null;
    }
    // Build structured data for the specific light.
    const lightObj = {
      id: light.id || "N/A",
      name: light.metadata?.name || "Unnamed Light",
      type: light.type || "Unknown Type",
      isOn: light?.on?.on ? true : false,
      brightness: light?.dimming?.brightness || "N/A",
      xyColor: light.color?.xy ? { x: light.color.xy.x, y: light.color.xy.y } : null,
    };
    return lightObj;
  } catch (err: any) {
    console.error(`Failed to retrieve light ${lightId}:`, err.message);
    if (err.response) {
      console.error("Response Data:", err.response.data);
    }
    return null;
  }
}
