import { AxiosInstance } from "axios";

export async function setLight(
  axiosInstance: AxiosInstance,
  lightId: string,
  brightness?: number,  // Optional brightness (0-100)
  xyColor?: { x: number; y: number },  // Optional XY color
  isOn?: boolean // Optional On/Off state
): Promise<boolean> {
  try {
    console.log(`💡 Setting Light: ${lightId}`);
    
    // Build request payload dynamically based on provided values
    const requestBody: any = {};

    if (brightness !== undefined) {
      requestBody.dimming = { brightness };
      console.log(`🔆 Brightness: ${brightness}%`);
    }

    if (xyColor) {
      requestBody.color = { xy: { x: xyColor.x, y: xyColor.y } };
      console.log(`🌈 Color XY: (${xyColor.x}, ${xyColor.y})`);
    }

    if (isOn !== undefined) {
      requestBody.on = { on: isOn };
      console.log(`💡 Light State: ${isOn ? "ON" : "OFF"}`);
    }

    if (Object.keys(requestBody).length === 0) {
      console.error("⚠️ No values provided for update!");
      return false;
    }

    console.log("🚀 Sending request to update light...");
    const response = await axiosInstance.put(`/light/${lightId}`, requestBody);

    if (response.status === 200) {
      console.log(`✅ Light Updated: ${lightId}`);
      return true;
    } else {
      console.warn(`⚠️ Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (err: any) {
    console.error(`❌ Failed to update light (${lightId}):`, err.message);
    if (err.response) {
      console.error("📜 Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}
