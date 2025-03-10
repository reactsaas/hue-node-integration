import { AxiosInstance } from "axios";


/**
 * @deprecated Use `setLightColorGradient` instead.
 *
 * Sets the gradient on a light.
 * Note: The current implementation sends the on/off command along with the gradient settings.
 * It's recommended to separate power state updates from color/gradient updates.
 *
 * @param axiosInstance - Axios instance to use for HTTP requests.
 * @param lightId - ID of the light to update.
 * @param gradientColors - Array of XY color points (requires between 2 and 5 points).
 * @param isOn - The power state of the light.
 * @param brightness - The brightness value.
 * @param transition - Transition time.
 * @returns A promise that resolves to a boolean indicating success.
 */
export async function setGradient(
  axiosInstance: AxiosInstance,
  lightId: string,
  gradientColors: { x: number; y: number }[], // Array of XY color points
  isOn: boolean, // Default ON
  brightness: number, // Default brightness
  transition: number
): Promise<boolean> {
  try {

    if (!gradientColors || gradientColors.length < 2 || gradientColors.length > 5) {
      console.error("Gradient requires between 2 and 5 color points.");
      return false;
    }

    //console.log(`Gradient Points: ${gradientColors.length}`);
    gradientColors.forEach((color, index) => {
      console.log(`🎨 Point ${index + 1}: (${color.x}, ${color.y})`);
    });

    
    // Convert transition time from seconds to milliseconds if provided and greater than 0.
    let duration: number | undefined;
    if (transition && transition > 0) {
      duration = transition;
    }

    // Build request payload with dynamics.duration instead of a top-level transition property.
    const requestBody: any = {
      gradient: {
        points: gradientColors.map((xy) => ({
          color: { xy }
        }))
      },
      on: { on: isOn },
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
