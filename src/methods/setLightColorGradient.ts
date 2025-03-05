import { AxiosInstance } from "axios";

export async function setLightColorGradient(
  axiosInstance: AxiosInstance,
  lightId: string,
  gradientColors: { x: number; y: number }[], // Array of XY color points
  brightness: number, // Brightness value
  transition: number  // Transition time
): Promise<boolean> {
  try {
    if (!gradientColors || gradientColors.length < 2 || gradientColors.length > 5) {
      console.error("Gradient requires between 2 and 5 color points.");
      return false;
    }

    gradientColors.forEach((color, index) => {
      console.log(`🎨 Point ${index + 1}: (${color.x}, ${color.y})`);
    });

    // Use transition time if provided and greater than 0.
    let duration: number | undefined;
    if (transition && transition > 0) {
      duration = transition;
    }

    // Build request payload without the power state.
    const requestBody: any = {
      gradient: {
        points: gradientColors.map((xy) => ({
          color: { xy }
        }))
      },
      dimming: { brightness },
      dynamics: duration ? { duration } : {}
    };

    const response = await axiosInstance.put(`/light/${lightId}`, requestBody);

    if (response.status === 200) {
      console.log(`Gradient Applied to Light: ${lightId}`);
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
