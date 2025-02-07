import { AxiosInstance } from "axios";

export async function setGradient(
  axiosInstance: AxiosInstance,
  lightId: string,
  gradientColors: { x: number; y: number }[], // Array of XY color points
  isOn: boolean = true, // Default ON
  brightness: number = 60 // Default brightness
): Promise<boolean> {
  try {
    console.log(`🌈 Setting Gradient on Light: ${lightId}`);

    if (!gradientColors || gradientColors.length < 2 || gradientColors.length > 5) {
      console.error("❌ Gradient requires between 2 and 5 color points.");
      return false;
    }

    console.log(`🎨 Gradient Points: ${gradientColors.length}`);
    gradientColors.forEach((color, index) => {
      console.log(`🎨 Point ${index + 1}: (${color.x}, ${color.y})`);
    });

    console.log(`💡 Light State: ${isOn ? "ON" : "OFF"}`);
    console.log(`🔆 Brightness: ${brightness}%`);

    // Build request payload with correct Hue API structure
    const requestBody: any = {
      gradient: {
        points: gradientColors.map((xy) => ({
          color: { xy }
        }))
      },
      on: { on: isOn },
      dimming: { brightness }
    };

    console.log("🚀 Sending request to set gradient...");
    const response = await axiosInstance.put(`/light/${lightId}`, requestBody);

    if (response.status === 200) {
      console.log(`✅ Gradient Applied to Light: ${lightId}`);
      return true;
    } else {
      console.warn(`⚠️ Unexpected response status: ${response.status}`);
      return false;
    }
  } catch (err: any) {
    console.error(`❌ Failed to set gradient on light (${lightId}):`, err.message);
    if (err.response) {
      console.error("📜 Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}
